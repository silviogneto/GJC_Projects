   M S B A M L   `   `   `  ����  
SistemaXML    SistemaXML.Principal   5   	   \ XPresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35R NWindowsBase, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35W SPresentationCore, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35D 9http://schemas.microsoft.com/winfx/2006/xaml/presentation    R NSystem.Xaml, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5   	   @d2http://schemas.microsoft.com/expression/blend/2008     5   	   Jmc;http://schemas.openxmlformats.org/markup-compatibility/2006     5      -   5          � Title$  Sistema XML��5   	   $	��300��5	   	   $	��500��5
   	    � 
ResizeMode$ CanMinimize=�5   	    � WindowStartupLocation$ CenterScreen=�5   	    � Icon$ doc-xml.ico��6.   .��5      ]� .+�5      �� $��30��6   $	��Top=�6   $��Bottom=�62   .@�5      �� .��5      �� -   5         ��Name$ 	txtStatus��5      $��Pronto��6#   5      �� 5      -   5         ��Name$ 	separador��5      $y�Hidden=�6"   �� 5      .��5      � -   5         �Name$ barraProgresso��5      $	��100��6*   $��20��66    � Minimum$ 0Q�6B    � Maximum$	 100Q�6N   $y�Hidden=�6\   5      5      ]� 5      .+�5      �� $	��Top=�6   	 �� Padding$	 5q�6!   ._�5      �� .+�5      ]� .+�5      �� -   5        
 ��Name$
 btnEscolherArquivo��5      $��Escolher Arquivo Xml��6+   $��35��6J   $	��Top=�6V   $��Right=�6n   $	��120��6�   6�   �� 5      -   5         ��Name$ 
txtArquivo��5      $��Center=�6$   $��14(�6F   $��0,0,5,0q�6T   &   System.Windows.Media.TextOptions   TextHintingMode$ Animated=�6e    �� 
IsReadOnly . 6�   5      �� 5      -   5         ��Name$ chkManterArquivo��5      $��Bottom=�6*   $��0,5,0,0q�6B    d� 	IsChecked$
 TrueY�6S   $'��!Manter Cópia do Arquivo Original��6d   5      5       �� 5"      $��1q�6   
�������$	 5q�68   $��5,0,5,5q�6D   ._�5#      � -   5         �Name$ gridInfo��5#       � RowDefinitions 5$      �� 5%      $
��Auto �6   �� 5&      $
��Auto �6   �� 5'      $
��Auto �6   �� 5(      $
��Auto �6   �� 5)      $
��Auto �6    � ColumnDefinitions 5+      �� 5,      $	��200 �6   �� 5-      .+�50      �� $��0��6   $��0��6   $��<natOp>:��6*   $
��Bold"�6C   �� 51      -	   5        $ txtNatOp��51      $��1��6!   $��0��61    �� TextWrapping$ NoWrap=�6>   $��Center=�6k   $	��5,0q�6�   $��2q�6�   {�.  ��6T   �� *NatOp+6�   �� 53      $��0��6   $��1��6   $��	<indPag>:��6*   $
��Bold"�6D   �� 54      -
   5        $ 	txtIndPag��54      $��1��6"   $��1��62   $ NoWrap=�6?   $��Center=�6m   $	��5,0q�6�   $��2q�6�   {�.  ��6U   �� *IndPag+6�   �� 56      $��0��6   $��2��6   $��<modFrete>:��6*   $
��Bold"�6F   �� 57      -   5        $ txtModFrete��57      $��1��6$   $��2��64   $ NoWrap=�6A   $��Center=�6q   $	��5,0q�6�   $��2q�6�   {�.  ��6W   �� *
ModFrete+6�   �� 59      $��0��6   $��3��6   $'��!Percentual de Acréscimo da Nota:��6*   $
��Bold"�6U   �� 5:      $��1��6   $��3��6"   $��2,2,3,0q�6/    �� Orientation$ 
Horizontal=�6@   .+�5;      �� -   5        $ txtValorPercent��5;      $ NoWrap=�6)   $��Center=�6X   $	��5,0q�6z   $��60��6�   ��6?   �� *	Percent+6�   �� 5<      $��%��6   5=      �� 5?      -   5        $
 btnAlterarXml��5?      $��1��6%   $��4��65   $	��100��6B   $��0,2,2,4q�6N   $��Right=�6_   $��30��6�   .��6�   Alterar Xml6�   5@      5A      5B      5C      5D      