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
    public class Importar
    {
        #region Atributos

        public string NatOp { get; set; }
        public string IndPag { get; set; }
        public string ModFrete { get; set; }
        public double Percent { get; set; }
        public BackgroundWorker Worker { get; set; }

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

                var produtosEliminar = new List<XmlNode>();

                var produtos = xmlDoc.SelectNodes("//nsnfe:det", ns);
                int progressByProduct = 50 / produtos.Count;
                foreach (XmlNode node in produtos)
                {
                    XmlNode prod = node["prod"];

                    //Regras CFOP
                    //Se cfop == 6101 ou 6102 trocar para 5102
                    //se cfop == 5401 ou 5403 ou 6401 ou 6403 trocar para 5405
                    var cfopAtual = prod["CFOP"].InnerText;
                    if (cfopAtual == "6910" || cfopAtual == "5910")
                    {
                        produtosEliminar.Add(node);
                    }
                    else
                    {
                        if (cfopAtual == "6101" || cfopAtual == "6102" || cfopAtual == "5101")
                            prod["CFOP"].InnerText = "5102";
                        else if (cfopAtual == "5401" || cfopAtual == "5403" || cfopAtual == "6401" || cfopAtual == "6403")
                            prod["CFOP"].InnerText = "5405";

                        var valUnit = Convert.ToDouble(prod["vUnCom"].InnerText, provider);
                        var novoValor = Truncate(NovoValorPorPorcentagem(valUnit, Percent), 2);

                        prod["vUnCom"].InnerText = novoValor.ToString("F2", provider);
                        prod["vUnTrib"].InnerText = novoValor.ToString("F2", provider);
                        prod["vProd"].InnerText = (Convert.ToDouble(prod["qCom"].InnerText, provider) * novoValor).ToString("F2", provider);

                        #region Tag Imposto

                        XmlNode nodeImposto = node["imposto"];
                        nodeImposto.InnerText = "";

                        XmlNode nodeImpostoNovo = CriarInfoImposto(xmlDoc, prod["CFOP"].InnerText);
                        node["imposto"].InnerXml = nodeImpostoNovo.InnerXml;

                        #endregion

                        XmlNode nodeInfoAd = node["infAdProd"];
                        if (nodeInfoAd != null)
                            node.RemoveChild(nodeInfoAd);

                        XmlNode nodeInfCpl = node["infCpl"];
                        if (nodeInfCpl != null)
                            node.RemoveChild(nodeInfCpl);
                    }

                    progress = Progresso(progress, progressByProduct);
                }

                #region Remove produto indesejados

                foreach (XmlNode n in produtosEliminar)
                {
                    XmlNode parent = n.ParentNode;
                    parent.RemoveChild(n);
                }

                #endregion

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

        /// <summary>
        /// Metodo que monta o conteudo da tag imposto
        /// </summary>
        /// <param name="xmlDoc"></param>
        /// <param name="cfop"></param>
        /// <returns></returns>
        private XmlNode CriarInfoImposto(XmlDocument xmlDoc, string cfop)
        {
            XmlNode nodeImposto = xmlDoc.CreateElement("imposto");

            #region tag vTotTrib

            XmlNode nodeVTotTrib = xmlDoc.CreateElement("vTotTrib");
            nodeVTotTrib.InnerText = "0.00";

            nodeImposto.AppendChild(nodeVTotTrib);

            #endregion

            #region tag ICMS

            XmlNode nodeIcms = xmlDoc.CreateElement("ICMS");
            XmlNode nodeIcmsSn = xmlDoc.CreateElement("ICMSSN102");

            XmlNode nodeOrig = xmlDoc.CreateElement("orig");
            nodeOrig.InnerText = "0";

            nodeIcmsSn.AppendChild(nodeOrig);

            XmlNode nodeCsoSn = xmlDoc.CreateElement("CSOSN");
            if (cfop == "5102")
                nodeCsoSn.InnerText = "102";
            else if (cfop == "")
                nodeCsoSn.InnerText = "500";

            nodeIcmsSn.AppendChild(nodeCsoSn);

            nodeIcms.AppendChild(nodeIcmsSn);

            nodeImposto.AppendChild(nodeIcms);

            #endregion

            #region tag IPI

            XmlNode nodeIpi = xmlDoc.CreateElement("IPI");
            XmlNode nodeCEnq = xmlDoc.CreateElement("cEnq");
            nodeCEnq.InnerText = "999";

            nodeIpi.AppendChild(nodeCEnq);

            XmlNode nodeIpiNt = xmlDoc.CreateElement("IPINT");
            XmlNode nodeCst = xmlDoc.CreateElement("CST");
            nodeCst.InnerText = "53";

            nodeIpiNt.AppendChild(nodeCst);

            nodeIpi.AppendChild(nodeIpiNt);

            nodeImposto.AppendChild(nodeIpi);

            #endregion

            #region tag PIS

            XmlNode nodePis = xmlDoc.CreateElement("PIS");
            XmlNode nodePisNt = xmlDoc.CreateElement("PISNT");
            XmlNode nodePisCst = xmlDoc.CreateElement("CST");
            nodePisCst.InnerText = "08";

            nodePisNt.AppendChild(nodePisCst);

            nodePis.AppendChild(nodePisNt);

            nodeImposto.AppendChild(nodePis);

            #endregion

            #region tag COFINS

            XmlNode nodeCofins = xmlDoc.CreateElement("COFINS");
            XmlNode nodeCofinsNt = xmlDoc.CreateElement("COFINSNT");
            XmlNode nodeCofinsNtCst = xmlDoc.CreateElement("CST");
            nodeCofinsNtCst.InnerText = "08";

            nodeCofinsNt.AppendChild(nodeCofinsNtCst);

            nodeCofins.AppendChild(nodeCofinsNt);

            nodeImposto.AppendChild(nodeCofins);

            #endregion

            return nodeImposto;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="valor"></param>
        /// <param name="casas"></param>
        /// <returns></returns>
        private double Truncate(double valor, int casas)
        {
            var formato = Math.Pow(10, casas);
            return Math.Truncate(valor * formato) / formato;
        }

        #endregion
    }
}
