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
using System.ComponentModel;
using System.Text.RegularExpressions;

namespace SistemaXML
{
    /// <summary>
    /// Interaction logic for Principal.xaml
    /// </summary>
    public partial class Principal : Window
    {
        #region Attributes

        private string _pastaInicial;
        private string _fileFullName;
        private Modelo.Importar _importar;

        #endregion

        public Principal()
        {
            InitializeComponent();
        }

        #region Eventos

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            this._importar = new Modelo.Importar
            {
                NatOp = "VENDA DE MERCADORIA",
                IndPag = "0",
                ModFrete = "9",
                Percent = 10
            };

            this.gridInfo.DataContext = this._importar;
        }

        private void btnEscolherArquivo_Click(object sender, RoutedEventArgs e)
        {
            var dialog = new OpenFileDialog();

            try
            {
                dialog.Filter = "Arquivo XML (*.xml)|*.xml";
                dialog.Multiselect = false;

                if (!string.IsNullOrEmpty(_pastaInicial))
                    dialog.InitialDirectory = _pastaInicial;

                txtStatus.Text = "Aguardando seleção do arquivo";

                if (dialog.ShowDialog() == true)
                {
                    var arquivo = dialog.FileName;

                    txtArquivo.Text = System.IO.Path.GetFileName(arquivo);
                    _pastaInicial = System.IO.Path.GetDirectoryName(arquivo);
                    _fileFullName = arquivo;
                }

                txtStatus.Text = "Pronto";
            }
            finally
            {
                dialog = null;
            }
        }

        private void btnAlterarXml_Click(object sender, RoutedEventArgs e)
        {
            if (!string.IsNullOrEmpty(_fileFullName))
            {
                if (System.IO.File.Exists(_fileFullName))
                {
                    separador.Visibility = System.Windows.Visibility.Visible;
                    barraProgresso.Visibility = System.Windows.Visibility.Visible;
                    barraProgresso.Value = 0;

                    var worker = new BackgroundWorker();
                    worker.WorkerReportsProgress = true;
                    worker.DoWork += new DoWorkEventHandler(worker_DoWork);
                    worker.ProgressChanged += new ProgressChangedEventHandler(worker_ProgressChanged);
                    worker.RunWorkerAsync();
                }
                else
                {
                    MessageBox.Show("Arquivo .Xml não encontrado!");
                }
            }
        }

        private void worker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            barraProgresso.Value = e.ProgressPercentage;
        }

        private void worker_DoWork(object sender, DoWorkEventArgs e)
        {
            bool manterArquivo = false;

            Dispatcher.Invoke(new Action(() =>
            {
                txtStatus.Text = "Trabalhando em alterações no xml";

                manterArquivo = chkManterArquivo.IsChecked.Value;
            }));

            try
            {
                if (manterArquivo)
                {
                    var dir = System.IO.Path.GetDirectoryName(_fileFullName);
                    var newName = System.IO.Path.GetFileNameWithoutExtension(_fileFullName) + "_original.xml";

                    System.IO.File.Copy(_fileFullName, System.IO.Path.Combine(dir, newName), true);
                }

                ImportarXml(_fileFullName, (sender as BackgroundWorker));

                MessageBox.Show("Arquivo alterado com sucesso!", "Sistema XML");

                _fileFullName = "";
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Não foi possível finalizar a operação.{0}Erro: {1}", Environment.NewLine, ex.Message));
            }
            finally
            {
                Dispatcher.Invoke(new Action(() =>
                {
                    txtArquivo.Text = "";
                    separador.Visibility = System.Windows.Visibility.Hidden;
                    barraProgresso.Visibility = System.Windows.Visibility.Hidden;
                    txtStatus.Text = "Xml Alterado";
                }));
            }
        }

        private void txtValorPercent_PreviewTextInput(object sender, TextCompositionEventArgs e)
        {
            e.Handled = !IsNumber(e.Text);
        }

        #endregion

        #region Metodos

        private void ImportarXml(string nomeArquivo, BackgroundWorker worker)
        {
            _importar.Worker = worker;
            _importar.AlterarXml(nomeArquivo);
        }

        private bool IsNumber(string texto)
        {
            return new Regex(@"\d+").IsMatch(texto);
        }

        #endregion
    }
}
