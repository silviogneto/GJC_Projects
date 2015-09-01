using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;

namespace SistemaXML.Modelo
{
    internal class Importar
    {
        #region Atributos

        internal string NatOp { get; set; }
        internal string IndPag { get; set; }
        internal string ModFrete { get; set; }
        internal double Percent { get; set; }

        #endregion

        #region Metodos

        /// <summary>
        /// Faz a alteração das informações do arquivo xml
        /// </summary>
        /// <param name="nomeArquivo">Nome do arquivo .xml</param>
        internal void AlterarXml(string nomeArquivo)
        {
            var xmlDoc = new XmlDocument();

            try
            {
                var ns = new XmlNamespaceManager(xmlDoc.NameTable);
                ns.AddNamespace("nsnfe", "http://www.portalfiscal.inf.br/nfe");
                xmlDoc.Load(nomeArquivo);

                #region ide

                var nodeIde = xmlDoc.SelectSingleNode("//nsnfe:ide", ns);
                nodeIde["natOp"].InnerText = NatOp; // "VENDA DE MERCADORIA";
                nodeIde["indPag"].InnerText = IndPag; // "0";

                #endregion

                #region transp

                var nodeTransp = xmlDoc.SelectSingleNode("//nsnfe:transp", ns);
                foreach (XmlNode n in nodeTransp.ChildNodes)
                    LimparNodes(n);

                nodeTransp["modFrete"].InnerText = ModFrete; // "9";

                #endregion

                #region Produtos

                var produtos = xmlDoc.SelectNodes("//nsnfe:det", ns);
                foreach (XmlNode node in produtos)
                {
                    XmlNode prod = node["prod"];

                    var valUnit = Convert.ToDouble(prod["vUnCom"].InnerText);
                    var novoValor = NovoValorPorPorcentagem(valUnit, Percent);

                    prod["vUnCom"].InnerText = novoValor.ToString("F2");
                    prod["vUnTrib"].InnerText = novoValor.ToString("F2");
                    prod["vProd"].InnerText = (Convert.ToDouble(prod["qCom"].InnerText) * novoValor).ToString("F2");
                }

                #endregion

                xmlDoc.Save(nomeArquivo);
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

        #endregion
    }
}
