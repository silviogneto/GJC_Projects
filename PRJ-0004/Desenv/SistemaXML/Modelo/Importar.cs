using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;
using System.Globalization;
using System.ComponentModel;

namespace SistemaXML.Modelo
{
    internal class Importar
    {
        #region Atributos

        internal string NatOp { get; set; }
        internal string IndPag { get; set; }
        internal string ModFrete { get; set; }
        internal double Percent { get; set; }
        internal BackgroundWorker Worker { get; set; }

        #endregion

        #region Metodos

        /// <summary>
        /// Faz a alteração das informações do arquivo xml
        /// </summary>
        /// <param name="nomeArquivo">Nome do arquivo .xml</param>
        internal void AlterarXml(string nomeArquivo)
        {
            int progress = 0;
            var xmlDoc = new XmlDocument();

            try
            {
                var ns = new XmlNamespaceManager(xmlDoc.NameTable);
                ns.AddNamespace("nsnfe", "http://www.portalfiscal.inf.br/nfe");
                xmlDoc.Load(nomeArquivo);

                progress = Progresso(progress, 5);

                #region ide

                var nodeIde = xmlDoc.SelectSingleNode("//nsnfe:ide", ns);
                nodeIde["natOp"].InnerText = NatOp; // "VENDA DE MERCADORIA";
                nodeIde["indPag"].InnerText = IndPag; // "0";

                progress = Progresso(progress, 15);

                #endregion

                #region transp

                var nodeTransp = xmlDoc.SelectSingleNode("//nsnfe:transp", ns);
                foreach (XmlNode n in nodeTransp.ChildNodes)
                    LimparNodes(n);

                nodeTransp["modFrete"].InnerText = ModFrete; // "9";

                progress = Progresso(progress, 20);

                #endregion

                #region Produtos
                var provider = new NumberFormatInfo();
                provider.NumberDecimalSeparator = ".";
                provider.NumberGroupSeparator = ",";

                var produtos = xmlDoc.SelectNodes("//nsnfe:det", ns);
                int progressByProduct = 50 / produtos.Count;
                foreach (XmlNode node in produtos)
                {
                    XmlNode prod = node["prod"];

                    var valUnit = Convert.ToDouble(prod["vUnCom"].InnerText, provider);
                    var novoValor = NovoValorPorPorcentagem(valUnit, Percent);

                    prod["vUnCom"].InnerText = novoValor.ToString("F2", provider);
                    prod["vUnTrib"].InnerText = novoValor.ToString("F2", provider);
                    prod["vProd"].InnerText = (Convert.ToDouble(prod["qCom"].InnerText, provider) * novoValor).ToString("F2", provider);

                    progress = Progresso(progress, progressByProduct);
                }

                #endregion

                xmlDoc.Save(nomeArquivo);

                Progresso(100, 0);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                xmlDoc = null;
            }
        }

        /// <summary>
        /// Metodo recursivo que limpa o conteudo de todas as tags a partir da tag pai
        /// </summary>
        /// <param name="node">Node xml que está sendo tratado</param>
        private void LimparNodes(XmlNode node)
        {
            foreach (XmlNode n in node.ChildNodes)
            {
                LimparNodes(n);
                n.InnerText = "";
            }

            if (node.ChildNodes.Count == 0)
                node.InnerText = "";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="valor"></param>
        /// <param name="porcentagem"></param>
        /// <returns></returns>
        private double NovoValorPorPorcentagem(double valor, double porcentagem)
        {
            return valor + (valor * (porcentagem / 100));
        }

        /// <summary>
        /// Atualiza status de progresso de termino da alteração do Xml
        /// </summary>
        /// <param name="progresso"></param>
        /// <param name="porcentagem"></param>
        /// <returns></returns>
        private int Progresso(int progresso, int porcentagem)
        {
            progresso += porcentagem;
            Worker.ReportProgress(progresso);
            return progresso;
        }

        #endregion
    }
}
