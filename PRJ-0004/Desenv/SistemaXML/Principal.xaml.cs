using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using Microsoft.Win32;

namespace SistemaXML
{
    /// <summary>
    /// Interaction logic for Principal.xaml
    /// </summary>
    public partial class Principal : Window
    {
        #region Attributes

        private string _pastaInicial;

        #endregion

        public Principal()
        {
            InitializeComponent();
        }

        #region Eventos

        private void btnEscolherArquivo_Click(object sender, RoutedEventArgs e)
        {
            var dialog = new OpenFileDialog();

            try
            {
                dialog.Filter = "Arquivo XML (*.xml)|*.xml";
                dialog.Multiselect = false;

                if (!string.IsNullOrEmpty(_pastaInicial))
                    dialog.InitialDirectory = _pastaInicial;

                if (dialog.ShowDialog() == true)
                {
                    var arquivo = dialog.FileName;

                    txtArquivo.Text = System.IO.Path.GetFileName(arquivo);
                    _pastaInicial = System.IO.Path.GetDirectoryName(arquivo);

                    ImportarXml(arquivo);
                }
            }
            finally
            {
                dialog = null;
            }
        }

        #endregion

        #region Metodos

        private void ImportarXml(string nomeArquivo)
        {
            var imp = new Modelo.Importar();
            imp.AlterarXml(nomeArquivo);
        }

        #endregion
    }
}
