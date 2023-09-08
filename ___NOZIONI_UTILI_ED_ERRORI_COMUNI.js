var ERRORI_COMUNI = `
ITEM <label class="argomento VB"></label> MANCA l'iCLASSI_SSQL nella Browse o nella Screen
ITEM <label class="argomento JS"></label>  NON USO IL SELETTORE JQUERY IN JAVACSRIPT MA CHIAMO COME SE FOSSI IN VB!
ITEM <label class="argomento JS"></label>  nel SELETTORE JQUERY manca il #
ITEM <label class="argomento"></label>  usato i simboli sbagliati per la stringa! (' in SQL, " in VB)
ITEM <label class="argomento"></label>  il CODICE del progetto corrente quando istanzio la screen/un oRboWin ('INV','KAI',...!)
ITEM <label class="argomento"></label>  la CONNESSIONE AL DATABASE corretta, se al db o al dbMaster
ITEM <label class="argomento"></label> Per le migliaia nella cwindef
	If IsNumeric(item.Cells(12).Text) Then item.Cells(12).Text = FormatNumber(item.Cells(12).Text, 0, , , TriState.True)
ITEM <label class="argomento"></label> Nella screen i punti critici che possono dare errore sono 
		<br>1) Iclassi_ssql sbagliato (mancano apici o non inizia con "SELECT...")
		<br>2) connessione sbagliata (serve Master vista l'Iclassi_ssql...)
		<br>3) il codice "INV" o "KAI" del progetto corrente!
		<br>4) Uno ShowLoading non definito sulla pagina che non fa neanche entrare nell'FCODE	
		<br>5) La chiave non viene passata correttamente (la passo con un alias che modifica il nome colonna)
		   La SCREEN non tira su i valori: non passo le chiavi nella query della browse!
		   La SCREEN non tira su i valori: non ho specificato il valore del tag BROWSE ed assume sia INS ===> 
			i campi sono vuoti per l'inserimento!! 
			Ci va <b>opTag.Scrivi("Browse", "Mod")</b>
		   La SCREEN non tira su i valori: l'IClassi_sSQL inizia con uno spazio (Left(IClassi_sSQL,6) deve essere "SELECT")
		<br>6) Non tira su i campi perchè ho chiamato una colonna della browse con uno slash o backslash e non è stato riempito correttamente il Tag!
		<br>7) Browse e Screen non condividono "la stessa classe base"
		<br>8) La screen usa una taella vistata, ma è stata cambiata la tabella e la vista non è stata aggiornata
		<br>9) Non funziona il salvataggio della screen --> ho personalizzato l'iclassi_Update della classe ed ho messo in fondo un 
"return true" anzichè il corretto "Return MyBase.IClassi_Update(connessione)" 
ITEM <label class="argomento VB"></label> 
Creare una browse:

1) lato html inserire 
        &lt;cbo:GridView ID="grdGriglia" runat="server" /&gt;
		ed in fondo METTERE SEMPRE (COME NELLA SCREEN):
		&lt;cbo:PlaceHolder ID="cboButtons" runat="server"&gt;&lt;/cbo:PlaceHolder&gt;
2) creare le property della classe
	Private Property m_Anagra As cAnagra
        Get
            Return CType(PageValue("m_Anagra"), cAnagra)
        End Get
        Set(value As cAnagra)
            PageValue("m_Anagra") = value
        End Set
    End Property

    Private Property m_WinDef As CBO.IWinDef
        Get
            Return CType(PageValue("m_WinDef"), cWinDef)
        End Get
        Set(value As CBO.IWinDef)
            PageValue("m_WinDef") = value
        End Set
    End Property
3) nell'init

		If Not IsPostback
			m_Anagra = New cAnagra
			m_Anagra.IClassi_sSQL = "SELECT * FROM ... WHERE $..$ AND '$...$'"      'ATTENZIONE AGLI APICI PER LE STRINGHE
			
			m_WinDef = New cWinDef
            RiempiGriglia()   
		End if 

		m_oBrowse = New CBO.CBrowse(CBO.enuAppPlatform.Web)
        m_oBrowse.ImgButtonEliminaWeb = "~/Images/Comuni/elimina.png"
        m_oBrowse.WinDef = m_WinDef

        m_oBrowse.Init(m_Anagra, Connessione, Me, "SIGLADELPROGETTODASOSTITUIRE", "~/frmAnagraBarcode_S.aspx", "IE")

4) Se ho filtri, nella load:
		'il button conferma, anche se non visibile va abilitato per i filtri
        Dim ctl As CBO.Web.UI.WebControls.Button = ControlFinder.PageFindControl(Me, "btnConferma")
        If Not ctl Is Nothing Then ctl.Enabled = True
		
4.5) 
	Private Sub AssociaFaseProduzione_B_InitComplete(sender As Object, e As EventArgs) Handles Me.InitComplete
         Dim btn As CBO.Web.UI.WebControls.Button

        btn = ControlFinder.PageFindControl(Me, "btnEsci")
        If Not btn Is Nothing Then btn.Attributes.Add("style", "display: none")

        btn = ControlFinder.PageFindControl(Me, "btnInserisci")
        If Not btn Is Nothing Then
            btn.Attributes.Add("style", "display: none")
            btnAggiungi.OnClientClick = "$('#" & btn.ClientID & "').click();return false;"
        End If

        btn = ControlFinder.PageFindControl(Me, "btnStpF8")
        If Not btn Is Nothing Then
            btn.Attributes.Add("style", "display: none")
            btnStampa.OnClientClick = "$('#" & btn.ClientID & "').click();return false;"
        End If
    End Sub

5) Per avere il filtro 'Cerca in tutte le colonne' 
	i)aggiungo prima di istanziare la browse:

	CBO.Web.Bootstrap.cGridFilterAll.AbilitaFiltroAll(grdGriglia, GridCommandItemDisplay.Top, CBO.Web.Bootstrap.cGridFilterAll.enuEspandiFiltro.SempreAperto)

	m_oBrowse = New CBO.CBrowse(CBO.enuAppPlatform.Web)
	....
	
	ii) OSS: per visualizzare la X che svuota il textBox, definisco la classe
			input[type="search"]::-webkit-search-cancel-button {    
				-webkit-appearance: searchfield-cancel-button !important;
			}
	
	iii) OSS: per intercettare il click sulla X che svuota il textBox 'Ricerca in tutte le colonne' in modo da filtrare la griglia dopo che ho pulito il filtro:

        $('#ctl00_body_grdGriglia_ctl00_ctl02_ctl00_cboFiltroTextbox').on('search', function () {
            javascript:__doPostBack('ctl00$body$grdGriglia$ctl00$ctl02$ctl00$cboFiltroButton','')
        });
		[PESCARE il corretto id tramite Ispeziona, attenziona a prendere l'ID e non il name!!]
		[se in un tag &lt;script&gt; della pagina html, metterlo in fondo al codice html, all'inizio potrebbe non funzionare...]

6) per avere i filtri in testata, nella query uso gli alias    AS [#nome_colonna]

7)forzo l'aggiornamento della griglia dopo averne cambiato la query sotto
	m_oBrowse.PopolaGriglia()
ITEM <label class="argomento VB"></label> 	
FILTRI BROWSE (Cerca in tutte le colonne punto 11)
0) Predispongo la query a db alla presenza della condizione WHERE e del Filtro:aggiungo nell'RBOWIN 

		WHERE 1&lt;&gt;1 $Filtro$
				oppure
		WHERE 1=1  $Filtro$

OSS: ovviamente l'assenza di un AND dipende da come vado a definire la stringa filtro, le CBO prendono la strFiltro che creo (nel punto 7b) e fanno un Replace($filtro$, strFiltro)
se inizializzo con sReturn += " AND 1=1 " allora lì non ci va

1) lato aspx creo i campi in cui leggere i valori per cui filtrare e un btnFiltra
2)IMPORTANTE la browse deve avere in fondo i cbobuttons, sennò non si riesce a filtrare correttamente
		&lt;cbo:GridView ID="grdGriglia" runat="server" /&gt;
		&lt;cbo:PlaceHolder ID="cboButtons" runat="server"&gt;&lt;/cbo:PlaceHolder&gt;
		
3) creo le property dove salvare i valori per non perderli al primo postback
4) nell'Init, DOPO AVER ISTANZIATO la browse, metto
			
			If Not IsPostBack Then RiempiGriglia()
			
5) Creao il metodo RiempiGriglia

Private Sub btnFiltra_Click(sender As Object, e As EventArgs) Handles btnFiltra.Click
        grdGriglia.CurrentPageIndex = 0
        m_oBrowse.PremiButton(System.Windows.Forms.Keys.F10)
    End Sub

(SE  HO ANCHE UN btnPulisci NE GESTISCO IL CLICK) 
    Private Sub btnAzzera_Click(sender As Object, e As EventArgs) Handles btnAzzera.Click
        AzzeraFiltri()
        grdGriglia.CurrentPageIndex = 0
        m_oBrowse.PremiButton(System.Windows.Forms.Keys.F9)
    End Sub



6)     Private Sub m_oBrowse_FCODE(ByRef KeyPress As Integer, ByRef Shift As Integer) Handles m_oBrowse.FCODE
        Select Case KeyPress
            Case System.Windows.Forms.Keys.F9
                AzzeraFiltri()
            Case System.Windows.Forms.Keys.F10
                RiempiGriglia()

7) ISTANZIO I METODI NECESSARI:

	Private Sub RiempiGriglia()
        Dim strFiltro As String = ""

        If Not IsPostBack Then InizializzaFiltri()
        SalvaFiltri()

        strFiltro = CreaFiltro()

        Dim opTag As New cProprieta
        opTag.Scrivi("", Tag)
        opTag.Scrivi("Filtro", strFiltro)
        Tag = opTag.Leggi
    End Sub


    Private Function CreaFiltro() As String
        Dim sReturn As String = ""
        sReturn += " AND 1=1 "

        If txtCampo.Text &lt;&gt; "" Then
            sReturn += ...
        End If

        Select Case cmbCampo.SelectedValue
            Case "1"
                sReturn += ...
            Case "0"
                sReturn += ...
        End Select

        Return sReturn
    End Function


    Private Sub AzzeraFiltri()
        txtCampo.Text = ""
        
        SalvaFiltri()
    End Sub

    Private Sub InizializzaFiltri()
        txtCampo.Text() = m_Campo
        
    End Sub


    Private Sub SalvaFiltri()
        m_Campo = txtCampo.Text()
        
    End Sub

10) verifico siano presenti queste gestioni degli eventi, nel caso le aggiungo!!
    (il secondo SERVE per il postback subito dopo il click sul filtra, sennò si aggiorna solo il datatable e non la griglia visualizzata!)

	Private Sub GestioneAnagraficaLotto_B_InitComplete(sender As Object, e As EventArgs) Handles Me.InitComplete
        Dim btn As CBO.Web.UI.WebControls.Button

        btn = ControlFinder.PageFindControl(Me, "btnEsci")
        If Not btn Is Nothing Then btn.Attributes.Add("style", "display: none")
    End Sub

    Private Sub GestioneAnagraficaLotto_B_Load(sender As Object, e As EventArgs) Handles Me.Load
        'il button conferma, anche se non visibile va abilitato per i filtri
        Dim ctl As CBO.Web.UI.WebControls.Button = ControlFinder.PageFindControl(Me, "btnConferma")
        If Not ctl Is Nothing Then ctl.Enabled = True
    End Sub			
	
	
11) Per avere il filtro 'Cerca in tutte le colonne' 
	i)aggiungo prima di istanziare la browse:

	CBO.Web.Bootstrap.cGridFilterAll.AbilitaFiltroAll(grdGriglia, GridCommandItemDisplay.Top, CBO.Web.Bootstrap.cGridFilterAll.enuEspandiFiltro.SempreAperto)

	m_oBrowse = New CBO.CBrowse(CBO.enuAppPlatform.Web)
	....
	
	ii) OSS: per visualizzare la X che svuota il textBox, definisco la classe
			input[type="search"]::-webkit-search-cancel-button {    
				-webkit-appearance: searchfield-cancel-button !important;
			}
	
	iii) OSS: per intercettare il click sulla X che svuota il textBox 'Ricerca in tutte le colonne' in modo da filtrare la griglia dopo che ho pulito il filtro:

        $('#ctl00_body_grdGriglia_ctl00_ctl02_ctl00_cboFiltroTextbox').on('search', function () {
            javascript:__doPostBack('ctl00$body$grdGriglia$ctl00$ctl02$ctl00$cboFiltroButton','')
        });
		[PESCARE il corretto id tramite Ispeziona, attenziona a prendere l'ID e non il name!!]		
ITEM <label class="argomento VB"></label> Aggiungere colonna nella cwinDef

        Dim RilevazioneColumn As New Telerik.Web.UI.GridBoundColumn
        RilevazioneColumn.DataField = ""
        RilevazioneColumn.HeaderText = ""
        RilevazioneColumn.UniqueName = "RilevazioneColumn"
        m_GrigliaWeb.Columns.AddAt(1, RilevazioneColumn)
        m_GrigliaWeb.Columns.FindByUniqueName("RilevazioneColumn").ItemStyle.Width = 30
		
e poi la gestisco nel metodo righe		
		
		If cFunzioni.Nz(item("Data").Text, "") = "" Then
            item("RilevazioneColumn").Text = "&lt;span class=""glyphicon glyphicon-time"" title=""Sequenza presente""&gt;&lt;/span&gt;"
        Else
            item("RilevazioneColumn").Text = ""
        End If
ITEM <label class="argomento"></label>  manca il TAG  SCRIPT aggiunto nell'head per il js personalizzato (o i tag NON sono nell' ordine corretto)!
ITEM <label class="argomento JS"></label> For each javascript su un array esempio:

		arr.forEach(function(element, index){
			if ((index)%10 == 0) s += '</tr><tr>'
			s += '<td>' + element + '</td>'
		});
ITEM <label class="argomento"></label>  su INVAT non funziona la browse ---> mettere nel case della Page.vb il nome del form!
ITEM <label class="argomento"></label>  la browse non cancella la riga: non passo le chiavi nella query della browse!
ITEM <label class="argomento"></label>  la browse non viene filtrata la primo click ma al secondo sì:
	<br>* nella Load manca il controllo sul btnConferma
	<br>* mancano i cbobuttons
ITEM <label class="argomento"></label>  SCREEN: non funziona un controllo e a seguire gli altri non funzionano!!
ITEM <label class="argomento"></label>  nella BROWSE filtra 2 volte perchè manca il seguente controllo nel Load
	<br>'il button conferma, anche se non visibile va abilitato per i filtri
    <br> Dim ctl As CBO.Web.UI.WebControls.Button = ControlFinder.PageFindControl(Me, "btnConferma")
    <br> If Not ctl Is Nothing Then ctl.Enabled = True
ITEM <label class="argomento"></label>  nel FILTRO che creo non ho messo lo spazio tra due controlli consecutivi!
ITEM <label class="argomento"></label>  nel JAVASCRIPT richiamo il NOME del form, ma in modo sbagliato (è case sensitive!)
ITEM <label class="argomento"></label>  nella SCREEN non inserisco le chiavi (eventualmente nascoste)!
ITEM <label class="argomento"></label>  nella browse/screen una modifica grafica avviene troppo presto/tardi e non è renderizzata!
ITEM <label class="argomento"></label> nella browse c'è un errore in fase di Conferma: ho modificato il testo di un campo avente datafield e quindi non riesce piu a salvarlo:
	<br>creare un textbox ausiliario txtDesc... senza DataField e qui mettere la stringa nuova. Nascondere il campo originario con il DataField.
ITEM <label class="argomento"></label>  nell'RBOWIN ho spostato dei pezzi e ci sono delle virgole di troppo prime del join/where
ITEM <label class="argomento"></label>  nell'RBOWIN non ho messo 'Formdialog' nel percorso!
ITEM <label class="argomento"></label>  manca il controllo sulla NON  NULLITA' di qualcosa in una query
ITEM <label class="argomento"></label>  nel REPORT aggiungo campi con =Field.[...] ma non li aggiungo nella query del click!
  <br>oppure li tiro su (in una browse) dai dati in tabella, ma mancano nei nomi eventuali simboli # o * 
  <br>oppure valorizzo io il campo con le parentesi quadre esterne che non vanno messe! le mettono le librerie!
  <br>Oppure non ho aggiunto la dipendenza del progetto principale (da cui lancio la creazione del report) dalla
  nuova libreria RPT!
ITEM <label class="argomento"></label>  nel report non faccio il DirectCast dei campi / sbaglio l'elemento padre !  
ITEM <label class="argomento"></label>  nel report errore alla riga
 <br>mObjStampa.Report.CboConnection = CBO.Web.UI.Page.Connessione<br>
 a cosa è dovuto?  <br>L'errore è nella CaricaStampa! (copia e incolla senza cambio del nome progetto? nome campi concatenati?)
ITEM <label class="argomento"></label>  manca $Filtro$ nell'rbowin!
ITEM <label class="argomento"></label>  ho aperto in due schede VisualStudio lo stesso progetto (sganciato e in linea?)! CHIUDERLI ENTRAMBI E APRIRNE UNO SOLO 
ITEM <label class="argomento"></label>  nell'RBOWIN ho commentato con i trattini (come su SQL) o con i //// (come in js): SI COMMENTA SOLO CON  /*  */
ITEM <label class="argomento"></label>  la query funziona su SQL perchè è scritta giusta, ma su VB non ho usato DBMaster e non funziona più!!
 <br>OPPURE la query su sql funziona perche mi metto sul db giusto, ma su vb uso un altro db!!! 
ITEM <label class="argomento"></label>   se non funziona un nuovo progetto perchè da errore LC.exe ==> svuotare il file licenses
ITEM <label class="argomento"></label> quando uso una cbrowsetoscreen devo ricordarmi che i campi presenti devono avere isKey="true" per essere editabili! 
ITEM <label class="argomento"></label> Presa una data per impostare la formattazione castandola a stringa devo fare attenzione al fatto che MM indica i MESI, invece mm indica i minuti!!!
 (.toString("yyyy-mm-dd") concatenerà l'anno, i minuti e i giorni!!)
ITEM <label class="argomento"></label> non aggiungo l'inherits nel form creato!! 
ITEM <label class="argomento"></label> un qualche bottone messo sopra la griglia viene incluso nella testata della griglia: i bottoni vanno messi in un class="row" e si risolve il problema 
ITEM <label class="argomento"></label> in javascript le stringhe si concatenano con il + e basta. Il comando & va bene solo in VB.
ITEM <label class="argomento"></label>  su db reale del cliente non riesco a loggare perchè non ho cambiato il Value nel webconfig! 
ITEM <label class="argomento"></label> la screen non salva le modifiche nonostante il click sul pulsante conferma perchè non ho aggiunto i cbobuttons su cui tale click andrà ad agire!
		&lt;cbo:PlaceHolder ID="cboButtons" runat="server"&gt;&lt;cbo:PlaceHolder&gt;		
ITEM <label class="argomento"></label> durante i test di una app perdo tempo a lanciare la app, chiuderla , lanciare la gestione: posso lanciare la app e andare sul progetto gestione, tasto dx Debug->avvia nuova istanza		 
ITEM <label class="argomento"></label> SQL: nel case-when non termino l'istruzione con un END 
ITEM <label class="argomento"></label> aggiungo dei valori a database ed aggiorno la griglia (vb o js) presente nello stesso form: al click sulla riga della griglia esegue più volte il comando relativo.
   <br>NON veniva distrutta la griglia precedentemente all'aggiornamento della browse! (successo con CarBox, autViaggiAllegati.js)   
ITEM <label class="argomento"></label> la dropdownlist/radcombobox non tira su nulla perchè la ho associata al campo sbagliato (la browse anzichè la screen!!!!)      
ITEM <label class="argomento"></label> NELLA BROWSE NON USARE iskey="true" !!!!! 
ITEM <label class="argomento"></label> non va qualcosa di bootstrap (menu, bottoni,...) ---> VERIFICARE I RIFERIMENTI A bootstrap.CSS e bootstrap.JS 
ITEM <label class="argomento"></label> gli spazi e maiuscole/minuscole nelle rbowin!!! 
ITEM <label class="argomento"></label> Quando si fa l'IClassi_Update ATTENZIONE ai nomi delle colonne!! DEVONO ESSERE QUELLI PRESNETI A DATABASE!! 
ITEM <label class="argomento"></label> L'IClassi_Update va in errore per violazione chiavi poichè un campo è sostituito male ---> ho scritto male nell'IClassi_sSQL i nomi tra dolalri e il tag del cProprieta non è sostituito correttamente
ITEM <label class="argomento"></label> la connessione è chiusa: POTREBBE ESSERE NON SPUNTATA LA VOCE SALVA PASSWORD NEL MYPROJECT QUANDO IMPOSTO LE CONNECTION STRING
   (cfr. persist security)   
ITEM <label class="argomento"></label> la screen non tira su i valori perchè non va bene l'IClassi_sSql poichè uso DatabaseMaster.dbo.nometabela: 
     mi devo spostare su Master usando la ConnessioneMaster nell'Init della Screen !!!!	 

ITEM <label class="argomento"></label> se non va un codice javascript che utilizza un webmethod verificare sia importato il riferimento a Functions.js dove è definito il metodo EsguiPageMethod!!	
ITEM <label class="argomento"></label> Errore nella GestioneTabelle:
- non funziona il Delete perchè non si era impostato il vincolo di primary key su sql in fase di creazione della tabella!!!!	
- non funziona la modifica perchè la tabella manca del campo AggID
ITEM <label class="argomento"></label> usando un javascript:__doPostBack(.....) non funziona perchè ho cambiato gli underscore con i $, va benissimo lasciare i dollari,
	  (anche se sto usando il controllo in codice html generato a runtime da vb!)	  	  
ITEM <label class="argomento"></label> errore chiamata web method: il nome della firma deve essere lo stesso neò javascript e nella definizione vb!	  
ITEM <label class="argomento"></label> Nella browse non tiro su la chiave (eventualmente con AS [*..] ) e non capisco perchè la screeen sembri funzionare in parte ----> nella screen funzionano solo i campi che sono passati tramite il Tag (ossia quelli presenti nella riga cliccata) 
ITEM <label class="argomento"></label> Nella screen/browse il click su un pulsante che clicka un cboButton (Modifica, esci, conferma) non funziona: c'è scritto che prima deve farre lo showloading ma non è definito nel form e va in errore prima di cliccarlo!!! 
ITEM <label class="argomento"></label> Nell'iclassiUpdate errore 'near W': non c'è nessuna condizione where ----> devo passare le chiavi reali e corrette nell'iclassiSsql!!!!!!!!! sennò non crea il where! 
ITEM <label class="argomento"></label> Errore nella gestione tabelle di salvataggio/modifica/eliminazione: NON ESISTE IL CAMPO CHIAVE! 
ITEM <label class="argomento"></label> HTML a runtime non funziona: NON VANNO USATO CONTROLLI TIPO CBO:... o ASP:..., ma i controlli html classici
ITEM <label class="argomento"></label> Nel FORMDIALOG manca il tag <form> (e da errore Me = nothing...) 
ITEM <label class="argomento"></label> nella browse non nasconde bene le colonne: vanno messe 2 righe x nascondere testata e colonna!
		<br>m_GrigliaWeb.Columns.FindByDataField("QtaFurgone").HeaderStyle.CssClass = "hidden"
        <br>m_GrigliaWeb.Columns.FindByDataField("QtaFurgone").ItemStyle.CssClass = "hidden"		
ITEM <label class="argomento"></label> il RecordSet della Browse è nothing, ma visualizzo la griglia:
		<br>a seguito del postback si è svuotato e quindi la griglia che vedevo funzionava correttamente, ora manca un qualche 
		<br>RiempiGriglia() da qualche parte in cui viene riempito il RecordSet!		
ITEM <label class="argomento"></label> Nei cMsg non usare nel testo tra " " l'apostrofo: viene visto come fine stringa da js e da errrore js sebbene scritto nel vb!!!!
  <br>[l'errore è Uncaught SyntaxError: missing ) after argument list ]  
ITEM <label class="argomento"></label> REPORT: in fase di creazione del progettoRPT aggiungere tutti i riferimenti necessari!
  <br>Sicuro quelli che ho aggiunto io su Carbox:
	<br>CBO, CBOStampe, CBOUtil, System.Web, Telerik.Reporting
	+ il riferimento a tale progetto nel progetto che crea i report		
ITEM <label class="argomento"></label> NON POSSO USARE UN Telerik.Web.UI.RadScriptManager.RegisterStartupScript(upIntCh, upIntCh.GetType, "1", sScript, True)
	nell'FCODE....	
ITEM <label class="argomento"></label> Nella cwinDef non riesco a selezionare una colonna con m_GrigliaWeb.Columns.FindByDataField()
  <br> ---> la colonna si chiama *Nome o #Nome! 
ITEM <label class="argomento"></label> la pagina crea controlli di tipo ctl01 anzichè ctl00: potrebbe essere che in fase di caricamento delle Autorizzazioni vi sia qualche errore!
   <br>(la property masterPage non va modificata dopo aver creato le Autorizzazioni)
		
ITEM <label class="argomento"></label> nella Browse da errore nell'Evaluete -----> è sbagliata la sigla del progetto!!!
ITEM <label class="argomento"></label> nell'InizializzaFiltri non compila giusto un combobox:
		<br>- errore nella query del combobox/nell'uso di datavaluefileld o datatextfield
		<br>- nel prerender:
			<br>'poichè al primo giro quando passa nell'inizializzafiltri non ha ancora tirato su i dati del combobox:
			<br>If Not IsPostBack Then cmbWsTuit.SelectedValue = m_WsTuit		
ITEM <label class="argomento"></label>  a seguito di uno SWITCH CASE nel js succede qualcosa di anomalo:
       <br> in un case manca un break; e viene eseguita anche l'opzione default 
ITEM <label class="argomento"></label> cScreen JAVASCRIPT: se ho due controlli con lo stesso cbodatafield viene preso in fase di lettura/scrittura "l'ultimo", vanno inserito da codice eventuali cbodatafield...
 <br>(cfr. CSI_MBE appPropostaLiquidazione.js, metodo CaricaDati())		
ITEM <label class="argomento"></label> ERRORE javascript del cbowebresource: MANCA QUALOCA NEL GLOBAL ASAX!!!
ITEM <label class="argomento"></label> Errore Internal server Error:
	<br>- ho scritto male (case sensitive) i parametri nel js rispetto al vb
	<br>- nel parametro json sono presenti a capo (o caratteri che non vanno bene, non saprei quali ad ora)
		<br>es.  op.Scrivi('', oScreen.CreaStringone().replaceAll("\n", "\\n"));    //per evitare problemi nel json sostituisco gli a capo 
ITEM <label class="argomento"></label> in una cbrowsetoscreen non crea una colonna nella griglia ---> quando la ho creata ho messo uno spazio nel primo valore(es. m_oGridFasi.Column.Add("Stato ", "Stato")	ANZICHè m_oGridFasi.Column.Add("Stato", "Stato")		)		
ITEM <label class="argomento"></label> errore login s database non demo: non ho cambiato il value di  HR usato dal cliente!	
ITEM <label class="argomento"></label> schermata gialla in un form con griglia di griglia: è dovuto all'itemexpand (cfr Ardes SchedaLottoProduzione)
ITEM <label class="argomento"></label> nonostante nell'F5 apra un form dialog va comuqnue alla screen senza (pagina che non esiste): ho lasciato nell'init della browse tale valore! sovrascrive il mio redirect dell'FCODE
ITEM <label class="argomento"></label> il report è blank: c'è qualcosa di Visible = false??? Qulcosa dell'Header straborda sul detail???		
ITEM <label class="argomento"></label> nel report non tira su niente se non un quadrato con l'errore riguardante il ContentText ---> l'errore ruguarda la query , non ho passato il tag "SOURCE" nell'opParam o è scritto male tipo "SQL"...		
ITEM <label class="argomento"></label> Il MsgBox non viene renderizzato ---> c'è un apostrofo che fa saltare il tutto!
ITEM <label class="argomento"></label> errore sull'evaluete: è sbagliata la sigla della browse
ITEM <label class="argomento"></label> CLiccando sul btnIndietro la screen è vuota: passare nel click il tag in cui specifico le chiavi (e il tag browse)
ITEM <label class="argomento"></label> Login: non funziona
	<br>- il codice applicazione (=valore nel web.config) è lo stesso associato all'utente che uso?
	<br>- maiuscole/minuscole
	<br>- copiando è rimasto scritto in qualche funzione/query il nome del vecchio 

ITEM <label class="argomento"></label> in una app Frontend non funziona il webservice 
		<br>- nel WS non è presente il Global.asax (errore nel send)
		<br>- passo parametri sbagliati (troppi/pochi o errore maiuscolo/miniscolo)
		<br>-nell'app js il riferimento all'UrlService è sbagliato: il WS gira su un'altra porta)
ITEM <label class="argomento"></label> non tira su le glyphicon (ma bootstrap funziona) ---> manca la cartella Fonts con dentro i glyphicon
ITEM <label class="argomento"></label> se la browse non trova i System.Windows.Forms agg nel MYPROJECT	
	<br>C:\Program Files (x86)\Reference Assemblies\Microsoft\Framework\.NETFramework\v4.5.1\System.Windows.Forms.dll
ITEM <label class="argomento"></label> "Impossibile trovare il membro pubblico 'Path' nel tipo 'gesdefault_aspx'" --->  il form non presenta l'inherit al Page corretto!!
ITEM <label class="argomento"></label> Nelle librerie non posso usare CBO.Web.UI.Page.*!!! (soprattutto se devo registrare un evento!=)
ITEM <label class="argomento"></label> Nell'update da l'errore "Connessione chiusa" ---> nel Myroject manca la spunta SALVA PASSWORD
ITEM <label class="argomento"></label> Per fare un "update a mano" tramite IClassi_Update, nel caso debba passare un decimale scriverlo nell'IClassi_Proprieta come "3,14" 
   <br>anzichè nel formato "3.14" (che è la formattazione che si usa su SQL...)
ITEM <label class="argomento"></label> Errori con i riferimenti: i Framework non sono uguali nei vari progetti		
ITEM <label class="argomento JS"></label> Il Bactick è ALT+96
La e accentata maiuscola È è ALT+0200
La tilde ~ è ALT+126
ITEM <label class="argomento"></label> Al conferma del Form Dialog passa dall'F10 ma non entra nell'AferUpdate ---> uso un Overrides Function IClassi_Update che non fa andare a buon fine l'update!
ITEM <label class="argomento"></label> Non compila l'AggID/Da errore sull'AggId ---> il tipo non èp Timestamp!!
ITEM <label class="argomento"></label> Aggiornare la griglia di una cBrowseToscreen:
		PopolaDtProduzioni()
		grdProduzioni.DataSource = m_dtProduzioni
		grdProduzioni.Rebind()
ITEM <label class="argomento"></label> Non riesco a cambiare la grafica della griglia nonostante le modifiche nella cWinDef siano applicate ---> modificare ad hoc il css che le va a sovrascrivere!
		Es. .RadGrid_Bootstrap .rgAltRow>td {
				background-color:  transparent;
			}
ITEM <label class="argomento"></label> Il report da problemi durante la registrazione evento nelle cStampa: 
		sulla kai_TabReportWEB il nome è CASE-SENSITIVE!		
ITEM <label class="argomento"></label> Per spezzare/mantenere sulla stessa pagina un report o subreport usare KeepTogether = False/true		
	(per il subreport va fatto dal report con tasto dx click proprietà)
ITEM <label class="argomento"></label> Per aprire il DbManager in modo che sia abilitato il pulsante RboWin devo lanciarlo con \DEV
		- Sul mio pc posso aggiungerlo nel path direttamente
		- Sul server devo invece (per non lasciare in chiaro tale possibilità di modifica delle rbowin) fare WIN+R e lanciare il path con \DEV
ITEM <label class="argomento"></label> Al click sul btn dopo l'evento js passa l'evento VB, non si stoppa con un return false
			usare event.preventDefault();
ITEM <label class="argomento"></label> Per usare fancybox:
		
&lt;link href="Css/jquery.fancybox.min.css" rel="stylesheet" /&gt;
		&lt;script src="Scripts/jquery.fancybox.min.js"&gt;&lt;/script&gt;

		&lt;script&gt;
			$(document).ready(function () {
				$.fancybox.defaults.clickOutside = "close";
				$.fancybox.defaults.clickSlide = "close";
				$.fancybox.defaults.loop = true;
			});
		&lt;/script&gt;
		
		ed aggiungere i file js e css	
ITEM <label class="argomento"></label> Nascondere colonna nella cwinDef 
- per nome:
		m_GrigliaWeb.Columns.FindByDataField("DataChiusura").HeaderStyle.CssClass = "nascosto"
        m_GrigliaWeb.Columns.FindByDataField("DataChiusura").ItemStyle.CssClass = "nascosto"
        m_GrigliaWeb.Columns.FindByDataField("DataChiusura").Display = False	

- per indice numerico:
        m_GrigliaWeb.Columns(m_GrigliaWeb.Columns.Count - 2).HeaderStyle.CssClass = "nascosto"
        m_GrigliaWeb.Columns(m_GrigliaWeb.Columns.Count - 2).ItemStyle.CssClass = "nascosto"
        m_GrigliaWeb.Columns(m_GrigliaWeb.Columns.Count - 2).Display = False		
ITEM <label class="argomento"></label> L'ordinamento della colonna con una data non funziona: ordina come se fosse una stringa non una data!
	OSS: Nelle query non usare mai i CONVERT/CAST per formattare la data perchè il risultato è un Varchar e quindi se volessi riordinare la colonna 
	lka browse utilizzerebbe un ordinamento lessicografico anzichè quello temporale!
ITEM <label class="argomento"></label> Nel browser chrome della VM non visualizzo correttamente eventuali popup: disabilitare l'accelerazioen hardware!		
ITEM <label class="argomento"></label> Per le righe che si esplodono servono:
	<br>1) campo @ nella query
	<br>2) codice html ad hoc:<br>
	&lt;ClientSettings&gt;
		&lt;ClientEvents OnRowClick="RowClick" /&gt;
	&lt;ClientSettings&gt;
	&lt;MasterTableView EnableHierarchyExpandAll="true" HierarchyLoadMode="Client"&gt;        
		&lt;NestedViewTemplate&gt;
			&lt;div class="row" style="background-color: #ebf8ff;margin: 0"&gt;
				&lt;div class="col-xs-12 col-md-6 col-lg-3"&gt;
					&lt;small&gt;&lt;em&gt;Impianto&lt;/em&gt;&lt;/small&gt;&lt;br /&gt;
					&lt;asp:LinkButton ID="btn" runat="server"
						OnClientClick='&lt;%#Eval("@codice", "javascript:Filtro({0});return false;")%&gt;'
						Text='&lt;%#Eval("@Impianto")%&gt;'&gt;
						&lt;/asp:LinkButton&gt;                                                                                   
				&lt;/div&gt;                                    
			&lt;/div&gt;                
		&lt;/NestedViewTemplate&gt;
	&lt;/MasterTableView&gt;
&lt;/cbo:GridView&gt;		
ITEM <label class="argomento"></label> Per gestire gli spazi e gli a capo posso usare le proprietà
	white-space: pre;	
	white-space: pre-line;
	white-space: pre-wrap;
	cfr. <a href='https://developer.mozilla.org/en-US/docs/Web/CSS/white-space' class='Link' style=''>developer.mozilla</a>
	
Altresì poso fare
	Replace(vbCrLf, "<br>")
ITEM <label class="argomento"></label> USARE UNO USER CONTROL

	1) Private ucInvioMailOrg As ucInvioMailOrg

	2) Nell'Init
		ucInvioMailOrg = LoadControl("~/UserControl/ucInvioMailOrg.ascx")

	3) pInvioMailOrg.Controls.Add(ucInvioMailOrg)	
ITEM <label class="argomento"></label> Nuovo tooltip Telerik:

sMotivoRidotto = item("Motivo").Text

'nuova gestione tooltip'
item("Motivo").Controls.Clear()
Dim label As New Label
With label
	.ID = "lblMotivo_" & item("*Id").Text
	.Text = sMotivoRidotto
	.Attributes("Multiline") = True
End With
Dim sInfoAgg As String = cDBUtility.DLookUp(MasterHR.Web.UI.Page.Connessione, "NoteAgg", "Telefonate_Ingresso", "Id =" & item("id").Text).Replace(vbCrLf, "<br>")

Dim Tooltip As New Telerik.Web.UI.RadToolTip
With Tooltip
	.RenderMode = Telerik.Web.UI.RenderMode.Lightweight
	.RelativeTo = Telerik.Web.UI.ToolTipRelativeDisplay.Element
	.Position = Telerik.Web.UI.ToolTipPosition.TopCenter
	.TargetControlID = "lblMotivo_" & item("*Id").Text
	If sInfoAgg <> "" Then
		.Text = sMotivo & "<br><br>" & "<b>Info Agg.</b><br>" & sInfoAgg
	Else
		.Text = sMotivo
	End If
	.AutoCloseDelay = 300000
End With

item("Motivo").Controls.Add(label)
item("Motivo").Controls.Add(Tooltip)
'fine tooltip

ITEM <label class="argomento"></label> Subreport Telerik:
In un report per aggiungere un sottoreport:

0) CREO il nuovo sottoreport (è come creare un report classico, scelgo Telerik (blank) e lascio solo il detail, tolgo header e footer)

1) una volta creato devo specificare quali sono le chiavi che dovranno essergli passate:
click sul vuoto: tasto dx Report Parameter ed aggiungo il parametro
click sul vuoto: tasto dx Filter e definisco il filtro che coinvolge il parametro 

2) aggiungo il subreport nel report 
tasto dx sul subreport: Report Source 

(per ulteriori dettaglio appunti sul quadreno)
ITEM <label class="argomento"></label> Per aggiungere lo showloading, devo aggiungere nella MasterPage

<telerik:RadAjaxLoadingPanel runat="server" ID="raLoadingPanel">
	</telerik:RadAjaxLoadingPanel> 

</script>
	function ShowLoading() {
		$find("ctl00_raLoadingPanel").show("aspnetForm");
	}
	function HideLoading() {
		$find("ctl00_raLoadingPanel").show("aspnetForm");
	}
</script>
ITEM <label class="argomento"></label> Scaricare uno .zip
Prima creo/copio in una cartella tutti i file da zippare, con path del tipo "...\TMP\..." poi:
aggiungere i riferimenti telerik 
	Telerik.WinControls
	Telerik.WindowsZip

in cima 
	Imports Telerik.WinControls.Zip.Extensions


	Dim zipPath As String = HttpContext.Current.Request.PhysicalApplicationPath & "Tmp\DownloadZIP_" & sDataOra & ".zip"
	ZipFile.CreateFromDirectory(sPathTmp, zipPath)
	Response.ContentType = "application/zip"
	Response.AddHeader("content-disposition", "attachment; filename=DownloadZIP_" + sDataOra + ".zip")
	Response.WriteFile(zipPath)
	Response.End()
ITEM <label class="argomento"></label> Scaricare allegato
<a id="btnWin" href="Supremo/SupremoLercari.exe" target="_blank"></a>
ITEM <label class="argomento"></label> Restore database grandi
SELEZIONARE il PATH per il ripristino in T:\DbSql\
scrivendo sia per il file .MDF si per il .LDF i percorsi, esempio:

T:\DbSql\ARDES.MDF
T:\DbSql\ARDES_1.LDF
ITEM <label class="argomento"></label> RegisterStartupScript:
        Dim sScript As String = "alert(1234)"
        ClientScript.RegisterStartupScript(Me.GetType, "", sScript, True)
ITEM <label class="argomento"></label> Se voglio che una property sia accessibile in ogni pagina del progetto, la aggiungo direttamente nella Page.vb dello specifico progetto (NON IN QUELLA CBO, essa ne è il padre!)
Tuttavia ogniqualvolta passo dal menu pulisco i pagevalue (e le property della pagina sono passate come PageValue della pagina) e quindi essa perderebbe il suo contenuto.
Per mantenere costante il valore lo salvo come oggetto di sessione, ad esempio

	Public Shared Property m_TipoAna As String
		Get
			Return CType(cFunzioni.Nz(System.Web.HttpContext.Current.Session("TipoAna"), ""), String)
		End Get
		Set(ByVal value As String)
			System.Web.HttpContext.Current.Session("TipoAna") = value
		End Set
	End Property

Per inizializzare il valore una sola volta, posso inizializzare la property nell'evento INIT della Page, in modo da 
			1.essere sicuro che la property viene inizializzata
			2. inizializzarla una sola volta (la classe la istanzio solo una volta essendo il padre di tutte le classi delle pagine)
ITEM <label class="argomento"></label> System.IO.Path.GetFileName(path)
ITEM <label class="argomento"></label> Per modificare un generico report personalizzato ed impostarlo da visualizzare su HR devo modificare il corrispondente valore nell RBO_STAMPE.

SE PERO' MODIFICO UN RAPPORTINO (la stampa di un intervento) devo modificare il valore nella kai_TabReportWeb!!
( per vedere il rapportino devo fare MLift,scelgo impianto, nuva chiamta, conf ed evadi, compilo i campi e conferma)
IMPORTANTE CHE IN RIGAREPORT1 CI SIA 15 perchè così usa telerik!
ITEM <label class="argomento"></label> Si trovano facendo
	  SELECT FileModelloMAil, * from [DEMO_MasterLift].[dbo].[AI_TabInterventi]
		\\serversviluppo\Resource-SourceSafe\AppWeb\MasterHR\MailClienti\Millepiani\Millepiani_InterventoChiamata_$.txt
oppure sono nel path presente nel tag scritto nel parametro MIM
		\\serverinternet\apps\MasterLift\Documenti2\ModelliMail

La cModelliMail espone un enumeratore: a partire da tale valore numerico creo il tag da mettere nel parametro
  <MODELLOn>path\File_$.txt</MODELLOn>
  e il nome del file è _$ perchè andrò di volta in volta ad apreire quello che voglio, infatti:

Esistono tre modelli per la mail: 
		quello per l'oggetto (_O)
		quello per il body   (_B)
		quello per la firma  (_F)

\\serversviluppo\Resource-SourceSafe\AppWeb\MasterHR\MailClienti\Millepiani\Millepiani_InterventoChiamata_$.txt
ITEM <label class="argomento"></label> Per ottenere la MasterPage di una pagina (per passarla come pagevalue, serve ere le autorizzazioni!) posso sempre fare

pv("m_MasterPage") = "~/MasterPageImpianti.Master"
ITEM <label class="argomento"></label> Master legge nella tabella TTW che è presente in ogni database (viene aggiunta in fase di installazione)
sono presenti le righe che rimandano ai vari database utilizzabili: esse sono quelle mostrate all'apertura di Master
nel menu a tendina 
ITEM <label class="argomento JS"></label>Per checkare un checkbox da javascript
$('#chkEseguito').prop('checked', true);
ITEM <label class="argomento"></label> 1) per ritagliare una immagine: scelgo lo strumento di ritaglio e poi INVIO per cancellare la parte esterna al taglio

2) per scalare l'immagine: dal menu in alto IMMAGINE -> SCALA IMMAGINE (OSS: se aumento i pixel della risoluzione diventa meno rumorosa!)

3) per esportare l'immagine in formato png/jpg: CTRL+SHIFT+E
ITEM <label class="argomento"></label> Per ripulire il più possibile i dati inseriti dal cliente in modo da evitare problemi causati da caratteri non riconosviuti 
dal codice:

1) //Invalid characters copied from internet get converted to 0xFFFD on parsing, so any invalid character codes would get 
	replaced with:  replaceAll(/\uFFFD/g, '')
	(https://stackoverflow.com/questions/12754256/removing-invalid-characters-in-javascript)
	Inoltre i caratteri di escape \ danno errore!
	
  ES: lato js posso fare
    $('#txt').change(function () {
        $('#txt').val($('#txt').val().replaceAll('\\', '-').replaceAll(/\uFFFD/g, ''));
    });
	
	
ITEM <label class="argomento"></label> FILTRI CON MULTISELEZIONE
1) lato .ASPX
	&lt;telerik:RadComboBox ID="cmb" runat="server" Width="100%" LarghezzaColonne="90;250" TypeControl="ComboBox" TypeData="Text" DataValueField="" DataTextField="" AccettaTesto="false"
                    CheckBoxes="true"  AllowCustomText="false" CheckedItemsTexts="DisplayAllInInput" &gt;                                
    &lt;/telerik:RadComboBox&gt;
	
2) lato RBOWIN	
	creo la query

3) lato VB	
 i) creo la property 
 ii) Nell'INIT, dopo aver istanziato la Browse
	
		Dim oDbWin As CInfoDBWin = CInfoDBWin.GetInfoDBWin(enuAppPlatform.Web, Connessione, "cer", CInfoDBWin.enuModalitaDBWin.F2, "~/cerPianificazioneVisite_B.aspx", "cmbTipoImpianto", 1)
		Dim dt As DataTable = cDBUtility.GetDataTable(oDbWin.SQLString, Connessione)
		cmbTipoImpianto.DataSource = dt
		cmbTipoImpianto.DataValueField = "Codice"
		cmbTipoImpianto.DataTextField = "Tipologia"
		cmbTipoImpianto.DataBind()
 
 iii) Nell'INIZIALIZZAFILTRI
 		'filtro per tipo impianto
        For Each tipo As String In m_FiltroTipoImpianto.Split(",")
            cmbTipoImpianto.FindItemByValue(tipo).Checked = True
        Next
 
 iv)Nel SALVAFILTRI
  'filtro per tipo impianto
        m_FiltroTipoImpianto = ""
        For Each item As RadComboBoxItem In cmbTipoImpianto.CheckedItems
            m_FiltroTipoImpianto += item.Value & ","
        Next
        If Right(m_FiltroTipoImpianto, 1) = "," Then m_FiltroTipoImpianto = m_FiltroTipoImpianto.Substring(0, m_FiltroTipoImpianto.Length - 1)

 v)Nel CREAFILTRO
		  'tipo impianti
        If cmbTipoImpianto.CheckedItems.Count > 0 Then
            sReturn += " AND AI_TabTipologie.Codice IN ("
            For Each item As RadComboBoxItem In cmbTipoImpianto.CheckedItems
                sReturn += "'" & item.Value & "', "
            Next
            sReturn = sReturn.Substring(0, sReturn.Length - 2)
            sReturn += ")"
        End If 
		
 
 
 vi) Nel PULISCI FILTRI
	 For Each item As RadComboBoxItem In cmbTipoImpianto.Items
            item.Checked = False
        Next
ITEM <label class="argomento"></label> DECLARE @Anno as varchar(10)
DECLARE @Progressivo as varchar(10)

SET @Anno = '2021'
SET @Progressivo = 'LTM'

DECLARE @NDef as integer
SET @NDef = (SELECT N_Def FROM $dbMaster$.dbo.mas_TabPro WHERE Codice = @Progressivo AND Anno = @Anno AND Lingua = 'ITA')

DECLARE @NIni as varchar(10)
SET @NIni = (SELECT LEFT(CAST(@Ndef as varchar(10)), 2)) + '00000'

CREATE TABLE #Lotti
(
    Lotto varchar(20)
)

WHILE (@NIni <=@NDef)
BEGIN
    INSERT INTO #Lotti (Lotto) VALUES ('MP' + @NIni)
	SET @NIni = @NIni + 1
END

ITEM <label class="argomento"></label> Dropdownlist con itemlist a sorgente

&lt;cbo:DropDownList ID="cmbInviati" runat="server" CssClass="form-control"&gt;
	&lt;asp:ListItem Value="NO"&gt;No&lt;/asp:ListItem&gt;
	&lt;asp:ListItem Value="SI"&gt;Sì&lt;/asp:ListItem&gt;
	&lt;asp:ListItem Value="TUTTI"&gt;Tutti &lt;/asp:ListItem&gt;
&lt;/cbo:DropDownList&gt;
ITEM <label class="argomento"></label> Disabilitare click cella

1) Nella cWinDef
   
   Private Sub ElencoOrdini_B__grdGriglia__1(ByRef CboObject As Object) 
		...   
        m_GrigliaWeb.Columns.FindByDataField("NOMECOLONNA").ItemStyle.CssClass = "DisableClick"
		
2) Nel js
	$(document).ready(function () {
		$('.DisableClick').click(false);
	});
ITEM <label class="argomento VB"></label> per ottenere la MasterPage di una pagina:
Page.MasterPageFile
ITEM <label class="argomento JS"></label> Detect if Chrome:
As of Chrome 89 (March 2021) Chrome now supports User Agent Hints. So now this should be done using:
	navigator.userAgentData && navigator.userAgentData.brands && navigator.userAgentData.brands.some(b => b.brand === 'Google Chrome')
This returns true for Chrome 89 and above, false for the latest Opera and Edge, and undefined for browsers that don't support userAgentData.
	
Codice da usare nel javascript del form login(o dopo se c'è gestione lingua e devo avere l'utente per intercettare la lingua corretta!)

    try{
        //if (!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime))
        if(!(navigator.userAgentData && navigator.userAgentData.brands && navigator.userAgentData.brands.some(b => b.brand === 'Google Chrome')) && localStorage['MBE_VerificaBrowser'] != 'Verificato')
        { localStorage['MBE_VerificaBrowser'] = 'Verificato';
            //alert('Attenzione: il software è sviluppato per funzionare correttamente sul browser Google Chrome. Usando un diverso browser alcune funzionalità potrebbero non funzionare correttamente') 
            // Attention: current application is fully supported by Google Chrome Browser. By using different browser some functionalities may not be working correctly
            alert(callWebService('ComuneWs.svc', 'GetMessaggio', '{ "CodApp" : "' + codApp + '", "CodLingua" : "", "CodMessaggio" : "VerificaBrowser" }'));
        }
    }
    catch(error)
    {   localStorage['MBE_VerificaBrowser'] = 'Verificato'
        //alert('Attenzione: il software è sviluppato per funzionare correttamente sul browser Google Chrome!')
        alert(callWebService('ComuneWs.svc', 'GetMessaggio', '{ "CodApp" : "' + codApp + '", "CodLingua" : "", "CodMessaggio" : "VerificaBrowser" }'));
    }

----------------------------------------------------------------------------------------------------------------------------------------------------------------
OLD (funziona, ma potrebbe dare falsi positivi)
!!window.chrome &&(!! window.chrome.webstore || !!window.chrome.runtime)
----------------------------------------------------------------------------------------------------------------------------------------------------------------
ITEM <label class="argomento"></label> Detect if android.....TODO!!   
ITEM <label class="argomento VB"></label> Per debuggare un servizio Windows:
1) Verifico che su Visual Studio sia presente la voce Debud anzichè Release, faccio Pulisci Soluzione e Ricompila
2) Installo il servizio che punti alla sottocartella Debug
2) Lancio vb
3) DEBUG -> Connetti a processo
4) se non vedessi il mio servizio --> spunta MOSTRA I PROCESSI DI TUTTI GLI UTENTI

se avessi le spunte bianche può essere che ho compilato sotto release e quindi non posso debuggarlo!

ITEM <label class="argomento VB"></label> Installazione di un servizio  Windows:
Il servizio da errore quando lo avvio se uso la connessione (local) !
Il servizio da errore se la connessione non contiene la password del server!
(ricordarsi anche il Language=US_English)
Impostare i parametri (TRS!)
ITEM <label class="argomento SQL"></label> Query utili:

<button class='btn btnCopia' onclick='CopiaDaDiv("q1")'>copia</button>
<div class='divCopia' id='q1'>
/****** Clear cache **************************/
DBCC FREEPROCCACHE
</div>
<button class='btn btnCopia' onclick='CopiaDaDiv("q2")'>copia</button>
<div class='divCopia' id='q2'>
/****** Cercare  NOME TABELLA con nome desiderato ***********/
SELECT TABLE_NAME  
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='Demo_MasterLift'
AND TABLE_NAME like '%contr%'
</div>
<button class='btn btnCopia' onclick='CopiaDaDiv("q3")'>copia</button>
<div class='divCopia' id='q3'>
/******** Cercare in tutto il database una COLONNA (e relativa tabella di appartenenza) con nome di colonna desiderato  *********/
SELECT      c.name  AS 'Colonna'
            ,t.name AS 'TABELLA',
		    INFORMATION_SCHEMA.COLUMNS.DATA_TYPE + ' ('+
			CASE WHEN INFORMATION_SCHEMA.COLUMNS.DATA_TYPE = 'numeric' THEN 				
				CAST(c.precision AS varchar(10))  +', '+  CAST(c.scale AS varchar(10))				
			ELSE CAST(c.max_length AS varchar(10))			
			END +')' AS [Tipo]
FROM        sys.columns c
JOIN        sys.tables  t   ON c.object_id = t.object_id
LEFT JOIN INFORMATION_SCHEMA.COLUMNS ON INFORMATION_SCHEMA.COLUMNS.table_name =  t.name
									AND INFORMATION_SCHEMA.COLUMNS.COLUMN_NAME = c.name	 
WHERE       c.name LIKE '%lotto%'   ---qui va il pezzo di nome della colonna cercata
ORDER BY    Colonna,TABELLA;

 
</div>
<button class='btn btnCopia' onclick='CopiaDaDiv("q4")'>copia</button>
<div class='divCopia' id='q4'>
/*******  Ritrovare la query in una finestra appena chiusa *****************/
SELECT txt.TEXT               AS [SQL Statement]
     , qs.LAST_EXECUTION_TIME AS [Last Time Executed]
FROM SYS.DM_EXEC_QUERY_STATS  AS [qs]
    CROSS APPLY SYS.DM_EXEC_SQL_TEXT(qs.SQL_HANDLE) AS txt
ORDER BY qs.LAST_EXECUTION_TIME DESC;
</div>
<button class='btn btnCopia' onclick='CopiaDaDiv("q5")'>copia</button>
<div class='divCopia' id='q5'>
/******* TABELLE SENZA AGGID o CON AGGID che NON è timestamp *********/
SELECT TABLE_NAME  as name
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_CATALOG='ardes_Produzione' AND TABLE_TYPE = 'BASE TABLE'
EXCEPT
SELECT t.name 
FROM sys.tables t
LEFT JOIN sys.columns c ON c.object_id = t.object_id
WHERE UPPER(c.name) = 'AGGID' AND system_type_id = '189'
</div><br>
<button class='btn btnCopia' onclick='CopiaDaDiv("q6")'>copia</button>
<div class='divCopia' id='q6'>
/**** TABELLE SENZA PRIMARY KEY*****************/
SELECT C.TABLE_NAME, COUNT(C.TABLE_NAME)
FROM  INFORMATION_SCHEMA.TABLE_CONSTRAINTS T  
JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE C  
ON C.CONSTRAINT_NAME=T.CONSTRAINT_NAME  
WHERE T.CONSTRAINT_TYPE='PRIMARY KEY'  
GROUP BY C.TABLE_NAME
HAVING COUNT(C.TABLE_NAME) = 0
</div><br>
<button class='btn btnCopia' onclick='CopiaDaDiv("q7")'>copia</button>
<div class='divCopia' id='q7'>
/***** Cerca tutte le colonne di tipo Varchar(MAX) **********/
DECLARE @NomeDatabase as varchar(100)
SET @NomeDatabase = 'ARDES_Produzione'

SELECT TABLE_NAME, COLUMN_NAME, *
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_CATALOG = @NomeDatabase
AND DATA_TYPE = 'varchar'
AND CHARACTER_MAXIMUM_LENGTH = '-1'
</div><br>
ITEM <label class="argomento SQL"></label>Esempi Query Insert/Update:
/********INSERT INTO***********/
INSERT INTO fla_Produzioni_D
(Tipo, Anno, Numero, Riga)
 
SELECT 
DOrd.Tipo, DOrd.Anno, DOrd.Numero, DOrd.Riga
FROM FLAMOR.dbo.mag_DOrdini DOrd
LEFT JOIN FLAMOR.dbo.mas_Articoli Art ON Art.CodArt = DOrd.CodArt
WHERE 1=1

/*OPPURE*/

INSERT INTO fla_Produzioni_D
(Tipo, Anno, Numero, Riga)
VALUES('ORC', '2023', '120', 30)

/***************UPDATE***************/
UPDATE fla_Produzioni_D 
SET CodArt = DOrd.CodArt, QtaProd = DOrd.Qta_Ord, DescArt = DOrd.Descrizione,
CodAna = DOrd.Codana
FROM fla_Produzioni_D ProdD 
LEFT JOIN FLAMOR.dbo.mag_DOrdini DOrd   
	ON ProdD.Tipo = Dord.Tipo AND ProdD.Anno = Dord.Anno  AND ProdD.Numero = Dord.Numero AND  ProdD.Riga = Dord.Riga 
WHERE 1=1

/****UPDATE con CASE WHEN *****/
UPDATE trs_Viaggi
SET Imp_StatoViaggio = CASE 
						WHEN DataViaggio < '2023-05-12 00:00:00.000' THEN 'P'
						ELSE 'X' END

/***********DELETE***********/
DELETE fla_Produzioni_D
FROM fla_Produzioni_D ProdD 
LEFT JOIN FLAMOR.dbo.mag_DOrdini DOrd   
	ON ProdD.Tipo = Dord.Tipo AND ProdD.Anno = Dord.Anno  AND ProdD.Numero = Dord.Numero AND  ProdD.Riga = Dord.Riga 
WHERE 1=1
ITEM <label class="argomento SQL"></label>  DECLARE @Today DATETIME;  
SET @Today = '2021-08-09';  
  
SET LANGUAGE Italian;  
SELECT DATENAME(month, @Today) AS 'Month Name';  
  
SET LANGUAGE us_english;  
SELECT DATENAME(month, @Today) AS 'Month Name' ; 		
ITEM <label class="argomento"></label> Nella cStart di certi programmi (tipo CarBox)
si verifica se il numero di versione salvato a DB è minore di quello nel webConfig attuale:

nel caso lo fosse, sono lanciati i metodi per aggiornare le rbowin e i parametri.

- Prima degli aggiornamenti apro l'RBOWIN e faccio "Genera Classe VB": 
copio nel codice la classe utilizzata nel metodo specifio.

- Per i Parametri invece devo creare a mano il codice relativo ai DB
 (tipicamenti in essi metto del codice di deafult in modo che se non compilati correttamente i parametri sul 
  server del cliente il programma funzioni correttamente.)
  
(tipicamente si occupa Matteo di tenere aggiornata la cStart)  
ITEM <label class="argomento"></label> passwordField.addEventListener( 'keydown', function( event ) {
  var caps = event.getModifierState && event.getModifierState( 'CapsLock' );
  console.log( caps ); // true when you press the keyboard CapsLock key
});
ITEM <label class="argomento VB"></label> Per testare un progetto (es. HR) su un database diverso da quello standard devo effettuare 3 modifiche:

1) Modificare le stringhe di connessione

2) prendere nel database Master dalla tabella "mas_WebTabApp" il "Codice" corretto (es. su ARDES MasterHR ha codice "HR", ma sul Demo è "03", altrove è "003".....)

3) Lanciare la query
		SELECT   t.name AS 'TABELLA' FROM sys.tables  t  WHERE t.name LIKE '%rbo%'  
   se trovo una rbowin personalizzata devo mettere nel web.config il valore nella riga
		<add key="NomeApplicazionePersonalizzata" value="***" />

4)PER LOGGARE con un nuovo utente presente nel database 
(credenziali non criptate scritte nella anapersone  nei campi [UtenteWeb] e [PasswordWeb], 
 credenziali criptate scritte nella mas_WebUtenti nei campi [WebUserID] e [WebPassword])
ITEM <label class="argomento"></label> Creazione app con frontend (.NET) e backend (JS)

1) Visual studio assegna automaticamente una porta sul localhost ai progetti: 
   i)visualizzare quale viene assegnata al WEB SERVICE (lanciandolo oppure dal MyProject\Web\URL Progetto)
   ii) Nel file app.js modificare di conseguenza l'urlWebService 
2) Nel file app.js modificare il prefisso con il nuovo prefisso del database e il codApp (dovrebbe essere sempre APP, ma
comuqnue verificare referenzi il campo Codice nella mas_WebTabApp)   



CREAZIONE DEL WS (Progetto con i Webservice)
0) Aggiungere un nuovo progetto <b style="text-decoration:underline">Libreria di classi</b> ProgettoDLL
1) Aggiungere un nuovo progetto (Visual Basic) <b style="text-decoration:underline">Applicazione WCF</b> ProgettoWS

OSS: nei riferimenti del WS aggiungere ProgettoDLL (MyProject -> Riferimenti -> Aggiungi -> Soluzione)

2) In ProgettoWS devono essere aggiunti
	- web.Config
		Nella connection string (CnnString) aggiungere  Current Language=US_English
	- Global.asax
	- Comune.vb (in cui ho i metodi VB specifici)
	- I file .svc con il servizio (Aggiungi -> Servizio WCF compatibile con AJAX)	
3) prendo dal MyProject la porta del localhost e la scrivo nell'app.js
4) creo la CnnString 

CREAZIONE DI UN PROGETTO (FRONTEND/BACKEND)
1)Aggiungere le cartelle Fonts, Images, Scripts, ClassVB
e riempirle di conseguenza!
	
IMPORTANTE NEL we.Config del BACKEND
&lt;authentication mode="Forms"&gt;
      &lt;forms name=".AUTCLKGES" loginUrl="gesLogin.aspx" timeout="480"/&gt;
    &lt;/authentication&gt;	
ITEM <label class="argomento"></label> Per aggiornare Master devo:
- se va aggiornata la struttura del database lanciato prima il server e poi il client
- se (come nel caso di noi in sviluppo) il db è gia aggiornato, lancio solo il client

OSS: noi scriviamo il numero di versione di Master nella TTW_LoginDatabase nella HTTP_REFERER

Gli eseguibili per l'aggiornamento si trovano su \\\\serverad\\CD-MASTER\\SETUP_MASTER

Se dopo che ho fatto l'aggiornamento al click sul pulsante per lanciare Master ho
<b>"Errore di run-time 432 Impossibile trovare nome di file o nome di classe durante un'operazione di automazione"</b>
verificare che il file Master.udl sia presente nella cartella di versione (e punti al giusto server SQL)
ITEM <label class="argomento"></label>Classi CBO utili per Browse e Screen 
CssClass="form-control" 

CssClassDisable="cboTextBoxDisable"
ITEM <label class="argomento VB"></label> Gestire checkbox nei report:
!!!NELL ItemDataBinding!!!
1) imposto il TRUEVALUE a 1 (di default è "true")
2) se non ancora impostato scrivo il test del checkbox NON in un txt a lato, ma nell'attributo Text del checkbox!
3) se dipende dal field.[...] scrivo la condizione  (value) lato progettazione
senno laro codice
	chkSi = DirectCast(Telerik.Reporting.Processing.ElementTreeHelper.GetChildByName(pInterv, "chkAutospurgoSi"), Telerik.Reporting.Processing.CheckBox)
	chkNo = DirectCast(Telerik.Reporting.Processing.ElementTreeHelper.GetChildByName(pInterv, "chkAutospurgoNo"), Telerik.Reporting.Processing.CheckBox)

	If r("EsitoSi") = "1" Then
	chkSi.Value = "1"
	chkNo.Value = "0"
	Else
	chkSi.Value = "0"
	chkNo.Value = "1"
	End If
	
-------
Per forzare il check di un checkbox:
dal form di Progettazione nel Value imposto  = True 
ITEM <label class="argomento"></label> COnnessione MAster nel reportDim CnnStringMaster As String = CBO.Web.UI.Page.Connessione.ConnectionString.Replace("_MasterLift", "")
ITEM <label class="argomento"></label> Report info utili:
Note Report:
1) i valori tirati su tramite =Fields.[nomecampo] sono i valori indicati nel select della query che si esegue al clik del pulsante Stampa!

1.5) 
se creoDim section As Telerik.Reporting.Processing.DetailSection = TryCast(sender, Telerik.Reporting.Processing.DetailSection)

posso fare sectionDataObject degli oggetti richiamati lì dentro con =Fields.[NomeCampoADatabase]


2)per nascondere un campo:
			se è nella section/nomePannello
            txt = DirectCast(Telerik.Reporting.Processing.ElementTreeHelper.GetChildByName(section/nomePannello, "ID"), Telerik.Reporting.Processing.TextBox)
            txt.Visible = False
			
            nomePannello.Visible = False
3)una volta effettuato il DirectCast a TextBox posso usare per l'elemento txt i classici attributi (.text, .height,...)

4)per impostarne l'altezza a n pixel

            nomePannello.Height = New Telerik.Reporting.Drawing.Unit("n px")
			
*****
Per nascondere una sezione: 
	rendere .Visible = false ed impostare l'altezza a 0 			
			
5) per passa re ad un report il datatable presente (senza dover specificare quindi la source nell'opParam) ( e per poter 
portarsi dietro eventuali ordinazioni della tabella) fare

cStampaHR.ApriStampa("Scadenzario", "Elenco_O", opParam, m_oBrowse.RecordsetFiltrato)

NON VA COMPILATO opParam.Scrivi("SOURCE,....) o tale comando viene ignorato!!!!
(assicurarsi che nella firm del emtodo vi sia la possibilità di passare tale datatable e che esista RecordsetFiltrato!)		

REPORT: in fase di creazione del progettoRPT aggiungere tutti i riferimenti necessari!
  Sicuro quelli che ho aggiunto io su Carbox:
	CBO, CBOStampe, CBOUtil, System.Web, Telerik.Reporting
	+ il riferimento a tale progetto nel progetto che crea i report	
ITEM <label class="argomento"></label> Report info utili 2:
IMPORTANTISSIMO
Per i report personalizzati creo un Namaespace ad hoc:
	non ha quindi senso avere un report personalizzato nel Namespace N che si chiama rNomeDelReport_N, 
	basta rNomeDelReport come per quello originale

TEST
per fare i test sui rapportini devo andare nell'elenco evasioni e selezionare una evasione esistente e con i valori di 
serieintervento, codtipoimpianto, codint
dell'evasione che corrispondono a quelli del report che voglio, come indicato nella kai_TabReportweb
ricreo il report e lo visualizzo

E SOPRATTUTTO 
se lavoro su db reale del cliente adattare il parametro DDI con un path esistente 

ITEM <label class="argomento"></label> SubReport:
1) se all'improvviso e senza motivo apparente sparisce il sottoreport dal pdf:
click, nella pagina di Progettazione, 
sul subreport ---> tasto dx reportsource e vedo se è associata una source o meno!



//CREARE SUBREPORT//
1) creo report normale
	a. Click sul vuoto Report Parameters aggiungo la chiave/parametro che userà la query del subreport (*)
	b. Filter: qui aggiungo il filtro per il parametro  (sennò tira su tutte le righe del db!)
	c. Click sul vuoto nella pagina del subreport: 
		- expression = fields.NomeCampo (**)
		- Operator (lascio "=" )
		- Value = Parametrs.NomeCampoValue (*)
2) Nel form del report aggiungo al subreport la datasource:
  a. (prima compilo il progetto RPT, senno potrebbe non suggerirmi il subreport appena creato!
     tasto dx sul subreport ---> Report Source ---> aggiungo il sottoreport creato (i.e. la CLASSE del subreport)
    (Load report from Object e lo seleziono)
 b. Edit Parameters ---> quì passo le chiavi  
5) Nel report: aggiungo la ReportSource del subreport
	ParameterName  = nomeCampo (**)
	ParameterValue = Fields.Nome Colonna Database
ITEM <label class="argomento"></label> Nei report fare attenzione a non usare le info relative all'utente nel detttaglio della stampa,
con nome dell'utente va non chi ha stampato il report al momento (= utente loggato)
ma l'assegnatario dell'intervento o al più chio presente nella manodopera!!! 

ITEM <label class="argomento"></label> 1) Nella kai_Organigramma creo (se serve) un nuovo livello e prendo il valore IdOrg corrispondente

2) Nella kai_OrganigrammaLegami aggiungo per ogni persona appartenente al livello creato una riga nuova dove specifico:
		- Cod_Persona che specifica un personaggio dell'AnaPersone
		- l'IdOrg ottenuto in (1)

3) Nella kai_TabStruOrg cerco la descrizione per il livello creato:
		- con CodStruOrg da 1 a 50 sono fissate da noi
		- con CodStruOrg > 50 possono essere create dal cliente		
    Selezionata dunque una riga aggiorno IdOrg con il valore definito in (1)
	
Il metodo per ottenere la lista delle mail:

Dim lista As New List(Of cProprieta) = MasterLiftDLL.cUtility.GetListaMailStruSoc(Connessione, CodStruOrg) 
restituisce una lista di cProprieta della forma
&lt;COD_PERSONA&gt;32&lt;/COD_PERSONA&gt;&lt;EMAIL&gt;paolo.agretti@leonardoinformatica.com&lt;/EMAIL&gt;

-------------------------------- Esempio ------------------------------------------------------------------
con CodStruOrg=20 ho il Reparto Qualità (ed è immutabile) perciò nel codice delle NonConformità faccio 
	lista = MasterLiftDLL.cUtility.GetListaMailStruSoc(Connessione, 20)
ed estraggo la lista con me mail del reparto qualità.

Ciò che cambia è l'idstruorg che identifica, nella riga della kai_TabStruOrg, il gruppo di persone definito tramite organigramma
ITEM <label class="argomento"></label> Nei report i campi selezionati dalla query nell'rbowin sono richiamati nel report con fields.nomecampo o alias

mentre nel vb puro (non progettazione) si chiamano con section..nomecampo o alias

ITEM <label class="argomento"></label> Per connettersi in FTP:
<b>Host</b>     service.leonardoinformatica.com
<b>User</b>      Leonardoftp
<b>Pwd</b>      Leonzio!01
<b>Porta</b>     21 (standard)

ITEM <label class="argomento SQL"></label> RowNumber:
SELECT 
ROW_NUMBER() OVER(ORDER BY xxxxx ASC) AS RowNumber,
......
FROM
....
WHERE
...
ORDER BY xxxxx
__________________________________________________________________________________
è fondamentale la clausola OVER(ORDER BY xxxxx ASC)

ITEM <label class="argomento JS"></label> // uso il selettore Javascript anzichè quello Html poichè contempla la gestione del parametro di priorità !important
document.getElementsByClassName("LDV")[i].style.setProperty('background-color', '#e35f5d', 'important');
ITEM <label class="argomento JS"></label> Jquery focus:
// Get the focused element:
var $focused = $(':focus');

// No jQuery:
var focused = document.activeElement;

// Does the element have focus:
var hasFocus = $('foo').is(':focus');

// No jQuery:
elem === elem.ownerDocument.activeElement
ITEM <label class="argomento JS"></label>
Per customizzare la selezione del testo posso usare la PseudoClass select

::selection {
  background: #ffff00;   
  color:#345678;
  /*text-shadow: #ffff00 1px 1px 10px, #ffff00 -1px -1px 10px;*/
}
ITEM <label class="argomento JS"></label> CSS per la gestione della scrollbar orizzontale tramite PseudoClass:        
        
        /* width */
        /*gestita come attributo del div*/
        div::-webkit-scrollbar {
            width: 2px;
            /*scrollbar orizzonatle: va usata height,scrollbar verticale va usata width!*/
        }

        /* Track */
        div::-webkit-scrollbar-track {
          box-shadow: inset 0 0 5px grey; 
          border-radius: 10px;
        }
 
        /* Handle */
        div::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-color: #5bc0de;
          outline: 1px solid #5bc0de;
        }      

        div::-webkit-scrollbar:vertical {
          display: none;
        } 
ITEM <label class="argomento JS"></label> Disabilitare componente tramite jquery
.attr('disabled', true).attr('onclick', 'return false;');	

con pointer-events:none 
posso disabilitare il cursore

Per invece riattivare il bottone
.attr('disabled', false).removeAttr('onclick');  

per disabilitare un RadComboBox
$find("ctl00_body_cmbUteApertura").disable()

ITEM <label class="argomento VB"></label> Non riconosce un elemento: non è scritta correttemente la classe (manca il codice davanti al nome, ...)
ITEM <label class="argomento VB"></label> Nella gsetione tabelle, nell'iclassi_sSQL ci va una query del tipo 
SELECT * FROM TABELLA WHERE CHIAVE = $CHIAVE$,
se non metto il "select *" ma "select campo1, campo2, ..." con i nomi delle colonne da errore in fase di update!
ITEM <label class="argomento VB"></label>  Nella Gestione TAbelle, quando creo la MAsterPageTabelle fare attenziona alla riga 
lButton.Attributes("href") = "javascript:__doPostBack('ctl00$ctl00$ZZZZZZ$btnMenu_" & Mnu.NomeTabella & "','')" nella MasterPageTabelle.Master.vb

Fare attenzione a mettere in ZZZZZZ il valore presente nella MasterPage nell'ID alla riga
 <asp:ContentPlaceHolder ID="corpo" runat="server">
Di default c'è content, noi mettiamo corpo o body, tale valore va messo anche al posto di ZZZZZZ e va richiamatao correttamente nella MasterPage nidificata che ho creato
da comunque errore se presente il valore di default e io lo ho cambiato....)
ITEM <label class="argomento JS VB"></label> Per scaricare un file ho 2 modi:
lato html 
 - href = "nomefile"
lato vb
 - Dim sScript As String = "window.location.href = """ & sPathFile & ""
            'ScriptPagina += sScript
			   oppure
 - Response.Redirect(sPathFile)
ITEM <label class="argomento VB"></label> cwinDef nascondere colonna
		m_GrigliaWeb.Columns.FindByDataField("Numero").HeaderStyle.CssClass = "nascosto"
        m_GrigliaWeb.Columns.FindByDataField("Numero").ItemStyle.CssClass = "nascosto"
        m_GrigliaWeb.Columns.FindByDataField("Numero").Display = False
ITEM <label class="argomento JS"></label> Disabilitare scroll orizzontale della pagina
	html, body {
		max-width: 100%;
		overflow-x: hidden;
	}
	
ITEM <label class="argomento JS"></label> 
Se un acartella è nascosta facendoIncludi nel progetto non è più nascosta
ITEM <label class="argomento"></label> Se all'apertura di un Form Dialog da error javascript sul GetRadWindow, aggiornare il metodo della functions.js con  il seguente:

    var oWindow = null;
    if (window.radWindow) oWindow = window.radWindow;
        //else if (window.frameElement.radWindow) oWindow = window.frameElement.radWindow;
    else if (window.frameElement) { if (window.frameElement.radWindow) oWindow = window.frameElement.radWindow; }
    return oWindow;
ITEM <label class="argomento JS"></label> Se nel report compare il messaggio di errore CommandText è perchè non è passato ancora una datasource valida

ITEM <label class="argomento"></label> Query utili per ArdesProduzione:

SELECT * FROM ard_Produzioni_D WHERE NumeroLotto LIKE '%%'
------------sostituire i @ con l'id desiderato--------------------------
DELETE FROM ard_Produzioni_Tempi
WHERE (IdProduzione = @)

UPDATE  ard_Produzioni_D
SET codcausaleincorso = '',
DataIniProd = NULL, OraIniProd = NULL, 
DataFineProd = NULL, OrafineProd = NULL, 
Eseguito = 0
WHERE        (IdProduzione = @)

DELETE FROM ard_ProduzioneMacchine WHERE IdProduzione = @
ITEM <label class="argomento VB"></label> ERRORI comuni nella gestione tabelle:
metto campo chiave un campo NON chiave
NON metto alcun campo chiave
Nell'IClassi_sSql un campo stringa non è scritto con gli apici! o è scritto sbagliato!
Nella query della griglia (la prima delle due) uso un alias sul campo chiave! Devo fare così:
	CodStato AS [*CodStato],CodStato AS [Codice],
ITEM <label class="argomento VB"></label> Nella BrowseToScreen non tira su una colonna ---> è case sensitive rispetto ai nomi delle colonen che passo: i nomi nel datatable devono coincidere con quelli che uso nel metodo Init della grigla
ITEM <label class="argomento VB"></label> Nella BrowseToScreen posso chiamare i valori delle righe nascoste con asterisco (*) tramite r("nome") anzichè r("*nome")
ITEM <label class="argomento JS"></label>  Per sfocare lo sfondo devo usare
backdrop-filter: blur(5px);
Fare attenzione al fatto che sfoca lo sfondo quindi impostare per l'oggetto 'sopra' z-index:99, altrimenti sarebbero sullo stesso livello e non si avrebbe il blurring
ITEM <label class="argomento JS"></label> Sostiyuire testo tramite Regex:
p.replace(regex, 'testo')
ITEM <label class="argomento telefono"></label> NUMERI DI TELEFONO RAPIDI:
Migliorini (Lercari):	0105446690 / 3385802066
Andrea De Caro (CF genova): 3427789387 / 0106121695
G. Morlacchi (CF milano): 3357788179
Chiara Calabretta (CF genova): 328/9069370
Ferretti Luca (CBOX genova): 0104074238
INVAT : 0143 823358
ARDES : 0109643197
Marco Pace (Pittaluga): 010/2750739
	    				010/2750731
ANDREA SCALABRINI : 329/7786400
ITEM <label class="argomento VB"></label> 
UpdatePanel:
Per scatenare i post back DELL'INTERA PAGINA ad ogni click di un pulsante all'interno dell'UpdatePanel devo usare i Triggers e l'attributo UpdateMode="Conditional"

Senza i postback continuano ad essere parziali!

&lt;asp:UpdatePanel ID="pNOME" runat="server" UpdateMode="Conditional"&gt;
	&lt;ContentTemplate&gt;
		
	&lt;/ContentTemplate&gt;
	&lt;Triggers&gt;
		&lt;asp:PostBackTrigger ControlID="btnF2_txtCodana" /&gt;	
		&lt;!--QUI VANNO GLI ID CONTROL ( = quelli presenti in html) dei pulsanti che voglio scatenino il postback,
		per gli F2 i pulsanti btnF2_txt sono creati dalle CBO--&gt;
	&lt;/Triggers&gt;  
&lt;/asp:UpdatePanel&gt;  
ITEM <label class="argomento VB"></label> AddFuturePageValue:
		<b>AddFuturePageValue("~/Pagina.aspx", pv)</b>        	 
	ATTENZIONE: non funziona se il nome passato non contiene la tilde o il .aspx!
				oppure
				nella browse è già scritta la screen di destinazione e le CBO sovrascrivono il pagevalue che passo
ITEM <label class="argomento VB"></label> 
Da errore il servizio dopo il caricamento di una applicazione in https:
nel web config per ogni pagina del progetto servizio va scritto nel tag services (li scrive di defualt per l'http in fase di scrittura codice, sono quelli commentati...)

&lt;services&gt;
      &lt;service name="CityLookWS.Autenticazione"&gt;
        &lt;!--&lt;endpoint address="" behaviorConfiguration="CityLookWS.AutenticazioneAspNetAjaxBehavior"
          binding="webHttpBinding" contract="CityLookWS.Autenticazione" /&gt;--&gt;
		          &lt;endpoint address=""
                  binding="webHttpBinding"
                  bindingConfiguration="secureHttpBinding"
                  contract="CityLookWS.Autenticazione"
				          behaviorConfiguration="CityLookWS.AutenticazioneAspNetAjaxBehavior"/&gt;

        &lt;endpoint address="mex"
                  binding="mexHttpsBinding"
                  contract="IMetadataExchange" /&gt;
      &lt;/service&gt;
ITEM <label class="argomento VB JS"></label> 
Gestione maiuscole/minuscole:
Lato CSS:
	text-transform: lowercase;	text-transform: uppercase;
Lato JS:
		.toUpperCase(); .toLowerCase();
Lato VB.NET
			ToLower, toUpper
Le Regex con flag i sono case insensitive

Un replace javascript insensitive è
	let auxRegex = new RegExp(TestoRicerca, "ig")
	let new_str = aux_str.replaceAll(auxRegex, newText);	
	
	oppure (senza RegExp)
	
	/^Cbo_Mes/i.test(s.trim())
ITEM <label class="argomento JS"></label> Self-Invoking Functions
Function expressions can be made "self-invoking".
 - Function expressions will execute automatically if the expression is followed by ().
 - You have to add parentheses around the function to indicate that it is a function expression:	
 (function () {
 
})();
ITEM <label class="argomento VB"></label> Multiselezione
1) OSS (al 05/07/2021):
	IN PRESENZA DI BROWSE CON MULTISELEZIONE LE COLONNE CON ALIAS DEL TIPO [*...] DANNO ERRORE
	MESSO  A POSTO NELLA LIBRERIA POCHI GIORNI FA (6 luglio 21)
	
	SE USO COLONNE SENZA ASTERISCO FUNZIONA SICURAMENTE TUTTO, ALTRIMENTI DA QUALCHE PARTE DA ERRORE...
	
2) NELLA cWinDef, nel metodo    ..._grdGriglia__1(ByRef CboObject As Object)    INSERISCO 
	i) per abilitare la multiselezione
	
	Private Sub Strumentazioni_B__grdGriglia__1(ByRef CboObject As Object)
		'abilito multiselezione
		m_Parametri.Scrivi("MULTISELEZIONE", "1")
		m_Parametri.Scrivi("MULTISELEZIONE_COLONNE_CHIAVE", "QrCodeStrumentazione")	
		
		!POSSO SEPARARE PIù COLONNE CON LA VIRGOLA!
		m_Parametri.Scrivi("MULTISELEZIONE_COLONNE_CHIAVE", "Anno, Numero, Riga")
		
	ii) per nascondere eventuali colonne per cui avevo errore (punto (1))
		
		Private Sub Strumentazioni_B__grdGriglia__1__Righe(ByRef item As Telerik.Web.UI.GridDataItem, ByRef CboObject As Object)
			'nascondo "a mano" le colonne  [IdLinea] e [CodReparto]
			m_GrigliaWeb.Columns.FindByDataField("IdLinea").HeaderStyle.CssClass = "nascosto"
			m_GrigliaWeb.Columns.FindByDataField("IdLinea").ItemStyle.CssClass = "nascosto"
			
	iii) per gestire le righe selezionate DEVO ESSERE NELL'FCODE
		 QUI POSSO USARE IL CONTROLLO  m_oBrowse.GetRigheSelezionate
		 
		 ES: 
		 
		 If m_oBrowse.GetRigheSelezionate.Rows.Count = 0 Then
                    Dim oMsg As New cMsg(Me, "Selezionare almeno una sinistro per cui scaricare la reportistica")
                    oMsg.Show()
                    Exit Sub
                Else
				...
				End If
		 End If
	iv) PUNTO CRUCIALE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	    i metodi cbo che gestiscono salvataggio delle righe spuntate sono generati a seguito di un F10
		Quindi il mio metodo che richiama le colonne selezionate deve in qualche modo essere gestito nell'FCODE F10
		
	v) 'pulisco la selezione
		m_oBrowse.DeselezionaTuttiWeb()
		
Per ogni dubbio cfr ARDES Ubicazioni_B.aspx		
ITEM <label class="argomento VB"></label> F2
Negli F2 ho due eventi distinti:
- F2code generato dopo aver selezionato la riga (passando alla lente di ingrandiemento)
- XCP: nel caso fosse abilitata la possibilità di scrivere nell'F2 è generato all'invio
ITEM <label class="argomento VB"></label> F2: cose utili
1) txt.F2Param = "&lt;CBOPAGESIZE&gt;8&lt;/CBOPAGESIZE&gt;&lt;ALLOWSORTING&gt;1&lt;/ALLOWSORTING&gt;&lt;ORDER&gt;CodAna&lt;/ORDER&gt;&lt;VALUE&gt;" & DbMaster & "&lt;/VALUE&gt;"
2) Nella query dell'F2 devo usare 
	- LIKE '%$txtRicercaF2$%' e non l'id del mio campo per poter eseguire le ricerche
	- $txtValueHid$ che andrà sostituito con il nome del database master specificato nel tag &lt;Value&gt;  
3)  //nascondo i pulsanti degli F2
	 (function () {
		 $('#ctl00_body_btnF2_txtCodArt').css('display', 'none');            
	 })();
ITEM <label class="argomento VB"></label> L'evento F2 o F2CODE non viene scatenato poichè sono in una screen e c'è scritto Handles m_oBrowse.F2CODE
ITEM <label class="argomento VB"></label> F2 con MULTISELEZIONE:
1) nella cWinDef creo il solito metodo 
	Private Sub pagina__txtNome__1(ByRef CboObject As Object)
        'abilito multiselezione
        m_Parametri.Scrivi("MULTISELEZIONE", "1")
        m_Parametri.Scrivi("MULTISELEZIONE_COLONNE_CHIAVE", "Codice")
    End Sub 
ed in cima al codice, sotto lo strWinKey va messo 
	'pulisco il campo multiselezione
	m_Parametri.Scrivi("MULTISELEZIONE", "0")
in modo che se avessi l'F2 nella stessa pagina di una griglia non forzi il codice per la multiselezione anche sulla griglia (e dia errore se non esiste la colonna!)
ITEM <label class="argomento VB"></label> Esportare su Excel da datatable:

Dim oDbWin As CInfoDBWin = CInfoDBWin.GetInfoDBWin(enuAppPlatform.Web, Connessione, "cer", CInfoDBWin.enuModalitaDBWin.F2, "~/cerAmministratoreStampeContabili_S.aspx", "Esporta", 1)

        sSQL = ""
        sSQL = oDbWin.SQLString
        sSQL = sSQL.Replace("$FiltroAmm$", sCodiciAmm)
        sSQL = sSQL.Replace("$DbMaster$", DbMaster)
        sSQL = sSQL.Replace("$DataRiferimento$", cDBUtility.GetDate(Connessione, cDBUtility.FormatoData.SoloData))

        dt.Clear()
        dt = cDBUtility.GetDataTable(sSQL, Connessione)

        If Not dt Is Nothing AndAlso dt.Rows.Count > 0 Then
            Dim sPathFile As String = Request.PhysicalApplicationPath & "Tmp\" & Utente.UserID & "\"
            If Not System.IO.Directory.Exists(sPathFile) Then System.IO.Directory.CreateDirectory(sPathFile)
            sPathFile += "EstrattoConto.xlsx"

            If cStampe.EsportaSuExcel(sPathFile, dt) Then
                Response.Redirect("Tmp/" & Utente.UserID & "/EstrattoConto.xlsx")
            Else
                Dim oMsg As New cMsg(Me, "Impossibile esportare i dati su Excel")
                MasterCertDLL.cEventi.Registra(Connessione, MasterCert.Web.UI.Page.Utente.UserID, Me.Path, "Anomalia: impossibile esportare i dati su Excel")
                oMsg.Show()
            End If
        End If
ITEM <label class="argomento VB"></label>	
Creare da path	
If Not System.IO.Directory.Exists(sPath) Then System.IO.Directory.CreateDirectory(sPath)

se esiste eliminare da path
If System.IO.File.Exists(sPath) Then
	System.IO.File.Delete(sPath)
End IF
ITEM <label class="argomento VB"></label> 	Viewstate
A seguito di un postback il combobox ha perso il valore selezionato
=>
View state maintains the state of all asp controls property on the page whenever the page post backs to the web server.
By default, view sate is enabled for every asp control. You can see View state in source view of a page and it is saved in hidden form field on the page. View state is good to maintain but it has also disadvantage that it stuffing too much data into view state and it slow down the process of rendering page.

You can maintain or disable individual control, page or an application.By default EnableViewState="True" for control, page or application.

Disable individual control using Control.EnableViewState property with false.

Use page directive to disable view state on page.
<%@ Page Language="VB" EnableViewState="false" %>
If you set EnableViewState property value false in page directive, then you cannot enable view state property in control level 
ITEM <label class="argomento VB"></label> 
CDate(cDBUtility.GetDate(Connessione, cDBUtility.FormatoData.SoloData)).AddDays()
ITEM <label class="argomento VB"></label> 
Il pagevalue non viene tirato su: è case sensitive!
ITEM <label class="argomento VB"></label> 
Creare al volo nuovo impianto ed evadere chiamata su di esso:
(Nel parametro $NC è riportato il numero di default dell'impianto Nuovo )
1) Menu tecnico
2) ricerca impianto
3) nuovo impianto (qui è tirato su il dettaglio dell'impianto con codice fisso 9999)
4) nuova chiamata
5) conferma --> errore: va avviata
6) menu tecnico --> evasione rapida
ITEM <label class="argomento VB"></label> 
Nel parametro $NC è riportato il numero di default dell'impianto Nuovo 
Nel caso stessi per compilare un rappotino di un intervento associato ad un impianto sconosciuto devo usare il blocco segente per gestire eventuali informazioni  base dell'impianto:

	If MasterLiftDLL.cParametri.rilparN("$NC", CBO.Web.UI.Page.Connessione) <> section.DataObject("Impianto") Then
		'caso impianto codificato a database
		Dim sSQL As String = "  SELECT ISNULL(Quartiere,'') AS [Quartiere], ISNULL(Indirizzo,'') + ' ' + ISNULL(Localita,'') + ' (' + ISNULL(Provincia,'') + ') ' + ISNULL(Cap,'') AS [Indirizzo] FROM AI_Impianti WHERE Codice = " & section.DataObject("Impianto")
		Dim op As cProprieta = cDBUtility.LeggiRecord(CBO.Web.UI.Page.Connessione, sSQL)
		txt = DirectCast(Telerik.Reporting.Processing.ElementTreeHelper.GetChildByName(pCliente, "txtIndirizzo"), Telerik.Reporting.Processing.TextBox)
		txt.Value = op.Leggi("Indirizzo")
		txt = DirectCast(Telerik.Reporting.Processing.ElementTreeHelper.GetChildByName(pCliente, "txtUbicazione"), Telerik.Reporting.Processing.TextBox)
		txt.Value = op.Leggi("Quartiere")
	Else
		'caso impianto nuovo
		Dim Cliente As String
		Cliente = section.DataObject("Cli_RagSoc") & "   -   "
		Cliente += section.DataObject("Cli_Indirizzo") & " - "
		Cliente += section.DataObject("Cli_Cap") & " "
		Cliente += section.DataObject("Cli_Localita") & " "
		If section.DataObject("Cli_Provincia") <> "" Then
			Cliente += "(" & section.DataObject("Cli_Provincia") & ")"
		End If

		txt = DirectCast(Telerik.Reporting.Processing.ElementTreeHelper.GetChildByName(pCliente, "txtIndirizzo"), Telerik.Reporting.Processing.TextBox)
		txt.Value = Cliente
	End If
ITEM <label class="argomento"></label> 
TODO da correggere!
1) gestione degli ime_i nella load

crea giusto solo 
btn = ControlFinder.PageFindControl(Me, "btnEsci")
        If Not btn Is Nothing Then btn.Attributes.Add("style", "display: none")
2) la classe contiene un _S che non ci va 

ec/bes
1) usare font-family: monospace;
ec
2) ricerca testuale case insensitive! ora "A" <> "a" FATTO!

bes
3) gestione dei $ime_i$ nella load

crea giusto solo 
btn = ControlFinder.PageFindControl(Me, "btnEsci")
        If Not btn Is Nothing Then btn.Attributes.Add("style", "display: none")
4) la classe contiene un _S che non ci va 
ITEM <label class="argomento JS"></label> 
function Copia(id){
	var copyText = document.getElementById(id);

	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */

	navigator.clipboard.writeText(copyText.value);
}

ondblclick="Copia()"
ITEM <label class="argomento VB"></label> Se in un oggetto cMsg scrivo nello show il path di un form, 
viene mostrato l'alert e viene eseguito un redirect alla pagina indicata!
ITEM <label class="argomento JS"></label> Property di tipo cProprieta:

Private Property m_sqlGraficiCorrenti As cProprieta
        Get
            Return CType(PageValue("m_sqlGraficiCorrenti"), cProprieta)
        End Get
        Set(value As cProprieta)
            PageValue("m_sqlGraficiCorrenti") = value
        End Set
    End Property

e la popola:
	
	 If m_sqlGraficiCorrenti Is Nothing Then
		m_sqlGraficiCorrenti = New cProprieta
	End If
	m_sqlGraficiCorrenti.Scrivi(sIdGrafico, strSql)
ITEM <label class="argomento VB"></label> Errore nel catch dell'IClassi_Update "Connessione chiusa": aprire il MyProject e verificare che sia presente in tutte le connection string la spunta "Salva Password"!
ITEM <label class="argomento VB"></label> Come popolare le tabelle cha per <b>aggiungere nuovo grafico</b>:
1)	Agg riga nella cha_TabGraficiSezioni
2)	Agg. Righe del dettaglio nella cha_TabGraficiElencoTest (sta per Testata!)
3)	Nella TabGraficiElencoDett vanno le query + un codice identificativo del grafico (verificare che non sia già presente né qui né in altre tabelle cha_)
OSS: usare nella query (se ho date)
Declare @DaData datetime
Declare @AData datetime

Set @DaData='$DaData$'
Set @AData='$AData$'

IF @DaData=''
   SET @DaData=(SELECT Convert(datetime, Str(Year(Getdate()),4)+'-01-01'))
IF @AData=''
   SET @AData=(SELECT Convert(datetime, Str(Year(Getdate()),4)+'-12-31'))
E sotto
WHERE NC.DataApertura BETWEEN @DaData And @AData

OSS: i datatable devono essere del tipo prima colonna: testo, seconda:numeri!
OSS: le query sono eseguite sul db Master, se uso oggetti MLift usare $DbMasterLift$!

4)	Nella SELECT * FROM cha_TabGraficiFiltri vanno scritti i filtri che userò
5)	Nella cha_ValoriFiltri saranno salvati i valori dei filtri
6)	Tip: nella DisegnaGrafico non posso richiamare per serieGrafico le proprietà dell’oggetto (se ColumnSeries, se LineSeries, ..) poiché è stato definito originariamente senza tipo e a runtime glielo assegno, quindi l’intellisense non mi aiuta: posso però metteremi temporanemanete nel Select Case m_ChartType e qui facendo dopo l’inizializzazione dell’oggetto .NomeAttributo vedo le proprietà esposte! 
ITEM <label class="argomento SQL"></label>
Abilitare statistiche tempo esecuzione query su SQL Server:
SET STATISTICS TIME ON

SET STATISTICS TIME OFF

Nella tasca Messaggi vedo il tempo effettivo
ITEM <label class="argomento"></label>
Per la creazione delle icone per le App Android/IOS e per la creazione del banner da usare sul PlayStore:
https://icon.kitchen/
ITEM <label class="argomento VB"></label>
Chiudere un form dialog
1) btnAnnulla.OnClientClick = "var wnd = GetRadWindow(); wnd.close();return false;"
2)  Private Sub m_oScreen_AfterUPDATE(ByRef p_Dati As cProprieta) Handles m_oScreen.AfterUPDATE
        ClientScript.RegisterStartupScript(Me.GetType, "close", "var wnd = GetRadWindow(); wnd.close();", True)
    End Sub
ITEM <label class="argomento VB"></label>
In un Form Dialog importanti i tag
	 &lt;cbo:ScriptManager ID="scriptManager" runat="server"&gt;&lt;/cbo:ScriptManager&gt;

            &lt;telerik:RadAjaxLoadingPanel runat="server" ID="raLoadingPanel"&gt;
            &lt;/telerik:RadAjaxLoadingPanel&gt;

ITEM <label class="argomento VB XAM"></label> Su Xamarin non va il debug ---> sono in modalità Release anzichè Debug!
ITEM <label class="argomento VB XAM"></label> Visual studio non vede il dispositivo collegato: eseguire Visual Studio come amministratore!
ITEM <label class="argomento VB XAM"></label> C# - dichiarazione variabili:
var name = "C# Corner"; // Implicitly typed.  
string name = "C# Corner"; // Explicitly typed. => type variableName = value;
ITEM <label class="argomento VB XAM"></label> C# - Property
	string sPathDownload = "";
	public string mPathDownload { get =&gt; sPathDownload; set =&gt; sPathDownload = value; }

Nell'interfaccia scrivo invece
	string mPathDownload { get; set; }
ITEM <label class="argomento VB XAM"></label> Per le icone da usare su Xamarin per le app Android e IOS USARE IL SITO IconKitchen
ITEM <label class="argomento VB"></label> 	
Se il codice della browse o screen non passa nell'FCODE potrei:
	-aver istanziato la screen/browse nell'if not isPostback anzichè fuori
	-aver scritto uno ShowLoading al click el pulsante e generar errore js perchè non è definito (e.g. sono in un FormDialog)
ITEM <label class="argomento VB"></label> 	
Nei report NON va passato il tag Filtro sennò si genera un errore "#text"
ITEM <label class="argomento VB"></label> 
Per forzare manualmente il sorting di un report devo mettere, nell'Item_DATABINDING

Dim sorting1 As New Telerik.Reporting.Sorting()
sorting1.Expression = "=Fields.ProductID"
sorting1.Direction = Telerik.Reporting.SortDirection.Asc

report1.Sortings.Add(sorting1)

Altresì facendo tasto destro 'sul nulla' e scegliendo sorting
ITEM <label class="argomento JS"></label> 
Se un bottone che ho nascosto e poi visualizzato è troppo grande/piccolo potrebbe essere colpa dell'attributo 'display'
se uso block puo essere più grande, meglio forse 'inline-block'...
ITEM <label class="argomento VB JS"></label> 	
Impostare le cifre decimali:
Lato aspx
	TypeData="numeric" Decimali="2"
Lato html/js	
	type="numeric" step="0.01"
ITEM <label class="argomento"></label> 
Non riesco ad aprire un txt da qualche parte sul server, file does not exist
---> ho notepad aperto in modalità amministratore! Aprire col blocco note
ITEM <label class="argomento VB"></label> 	
Se desse errori il salvataggio a database di alcuni campi numerici il problema potrebbe essere dovuto al fatto che i textbox abbiano TypeData="Text" ----> ci va TypeData="Numeric"
ITEM <label class="argomento JS"></label> 
Dopo che la pagina è stata caricata
document.addEventListener("DOMContentLoaded", function () {
    //dopo che la pagina è stata caricata eseguo un gestiscicampi per visualizzare i bottoni correttamente
    GestisciCampi();
});
ITEM <label class="argomento SQL"></label>Per verificare se ci sono delle transazioni aperte:
SELECT * FROM sys.sysprocesses WHERE open_tran = 1
ITEM <label class="argomento VB"></label> Duplicare un report:
1) Creo il report vuoto
2) Apro nella cartella del progetto la sottocartella Rpt: qui uno per volta apro nell'editpr di testo i file (report originale e report nuovo vuoto) con estensione
	.resx
	.Designer.vb
	.vb
Faccio un copia ed incolla dal report originale al mio con l'accortezza di cambiare eventuali Namespace e nomi delle classi	
ITEM <label class="argomento JS"></label> Per disbilitare il cursore: 
pointer-events:none
ITEM <label class="argomento VB"></label> 
Creare a runtime un filechooser (vedi certifor cerinterventoComponenti_S)
 ctlUpload = New Telerik.Web.UI.RadAsyncUpload
                    ctlUpload.ID = "upAllegato" & r("ID_DocStrd")
                    ctlUpload.MaxFileInputsCount = 1
                    ctlUpload.Localization.Select = "Sfoglia"
                    ctlUpload.Localization.Remove = "Rimuovi"
                    ctlUpload.OnClientFileSelected = "OnClientFileSelected"
                    ctlUpload.OnClientFileUploadRemoved = "OnClientFileRemoved"
                    GetTmpPath("upload")    'mi serve solo per creare eventualmente la cartella
                    ctlUpload.TemporaryFolder = "~/Tmp/" & Utente.UserID & "/upload"
                    ctlUpload.Attributes.Add("idTxt", "txtAllegato" & r("ID_DocStrd"))

                    pInterventoComponenti.Controls.Add(ctlUpload)
ITEM <label class="argomento VB"></label> Ciclare un cProprieta:
		For Each rComp As DataRow In m_Interventi.dtComponenti.Rows
			Dim opComp As New cProprieta
			opComp.Scrivi("", rComp("DatiTecnici"))

			'ciclo tutti i tag del cProprieta:se uno non è compilato restituisco messaggio di errore
			Dim i As Integer = 1
			While i <= opComp.Count
				If opComp.Leggi(opComp.nomeProprieta(i)) = "" Then
					oMsg.Messaggio = "Componenti: campo obbligatorio [" & opComp.nomeProprieta(i) & "] non compilato"
					oMsg.Show()
					keyPress = 0
				End If

				i += 1
			End While
		Next	
ITEM <label class="argomento VB JS"></label>
Per usare l'apostrofo in un alert/oggetto cMsg devo fare \'
oppure credo il ''
ITEM <label class="argomento JS CSS"></label>
Per autogestire il colore del testo:
mix-blend-mode: difference; /*si autogestisce il colore del testo*/
ITEM <label class="argomento VB"></label> Se da l'errore sulla mancanza del riferimento 'Rebex' devo aggiungere la cartella
ITEM <label class="argomento JS"></label> 
Usare i croprieta in js:

 var op = new cProprieta();
    var x = eseguiPageMethod('RiepilogoFasi_S.aspx', 'PreCompilaOrario', '{ "sIdProd" : "' + $('#lblIdProd').text() + '"}')
    op.Scrivi('', x)
ITEM <label class="argomento VB"></label>Esempio uso Substring in VB.NET
	
*) substring(startIndex, length)
	s = "012345"
	
	s.substring(0,2) ---> "01"
	'parte dall'indice zero e prende 2 caratteri
	
	s.substring(0,s.length - 1) ---> "01234"
	parte dall'indice zero e prende tutti i caratteri tranne l'ultimo

*) substring(length)
	s.substring(n) ---> "12345"
	parte di default dall'indice zero e prende n caratteri

Se l'ultimo carattere è virgola lo escludo:
	If sString.Substring(sString.Length - 1) = "," Then
		sString = sString.Substring(0, sString.Length - 1)
	End If
ITEM <label class="argomento JS"></label>Svuotare un div: 
	$('#ctl00_content_pDettaglioMaschera').html('');
	document.getElementById(elementID).innerHTML = "";
ITEM <label class="argomento VB"></label> 		
Svuotare un array:
	arr.length = 0;
ITEM <label class="argomento VB"></label> Metodo Select del datatable VB.NET:
Restituisce un array di datarow (ovviamente l'indice di riga parte da 0)
Es:
1) 	return dt.Select(sWhere, sOrder)(iRiga)("NomeColonna")
in sOrder vanno i nomi delle colonne separati da virgola
2)	Dim foundRows() As DataRow
	foundRows = table.Select(expression)
	Dim s as string = foundRows(iRiga)(iCol)
	
Per avere un datatable filtrato per valori unici:
	Dim distinctDT As DataTable = myDT.DefaultView.ToTable(True, "name")
	
Per trasformare un array di datarow indatatable:
dt.Select(...).CopyToDataTable()	

------
esempi:
If m_Articolo.dtArticoli.Select("CodStru = '" & r("CodStru") & "'").Length > 0 Then
	Continue For
End If	
ITEM <label class="argomento VB"></label>
Se volessi cambiare la source della griglia filtrando tramite Select il datatable posso usare CopyToDataTable per tornare da un array di datarow a datatable
es
	grdVerProt_Differenziali.DataSource = m_Interventi.dtVerificaProtezioni.Select("Tipo = 'Q'", "RIGA").CopyToDataTable()
OSS il controllo da fare prima del copy è (come per tutti gli array) 
	If m_Interventi.dtVerificaProtezioni.Select("Tipo = 'Q'", "RIGA").Length > 0 Then
ITEM <label class="argomento JS"></label> La connessione è giusta se la leggo dal MyProject ma apparentemente non funziona qualcosa: nel web config ho un a capo nella riga della connessione e da errore		
ITEM <label class="argomento JS"></label>Per gestire la lettura di un qrcode:
1) agg file + riferimento 
		&lt;script src="Scripts/anysearch.min.js"&gt;&lt;/script&gt; 
2) Nel ready aggiungere 
    // initialize anysearch plugin
    $(document).anysearch({
        minimumChars: 1,
        searchFunc: function (search) {
            //metodo da eseguire alla lettura del qrcode
        }
    });
    $('#anysearch-slidebox').css('display', 'none');	
ITEM <label class="argomento VB"></label>Abilitare il Custom errors
       La sezione &lt;customErrors&gt; consente di configurare 
       l'operazione da eseguire in caso di errore non gestito 
       durante l'esecuzione di una richiesta. In particolare, 
       consente agli sviluppatori di configurare le pagine di errore HTML 
       in modo che vengano visualizzate al posto della traccia dello stack dell'errore.

       &lt;customErrors mode="RemoteOnly" defaultRedirect="GenericErrorPage.htm"&gt;
         &lt;error statusCode="403" redirect="NoAccess.htm" /&gt;
         &lt;error statusCode="404" redirect="FileNotFound.htm" /&gt;
       &lt;/customErrors&gt;
        
    &lt;customErrors mode="On" defaultRedirect="Login.aspx"&gt;
    &lt;/customErrors&gt; 
ITEM <label class="argomento VB"></label>Per gestione esperienza (solo su mobile) nell'if not isPostback dell'init scrivo:

			'se su mobile  gest esp
            If ArdesProduzione.Page.Auth_NFC Then
                'm_CodUtente = ""   non credo serva.. nel dubbio lascio commentato
                '---Gestione Esperienza
                Dim opTag As New cProprieta
                '--- Controllo nel PageValue se apro la maschera da una esperienza
                If PageValue("Esperienza") Then
                    '--- Valido Esperienza
                    PageValue.Remove("Esperienza")

                    Dim opEsp As New cProprieta
                    opEsp.Scrivi("", cEsperienze.ValidaEsperienza(ArdesProduzione.Page.Connessione, ArdesProduzione.Page.Utente.UserID, "mobGestioneFaseProduzione_S.aspx", Cod_Persona))

                    If opEsp.Leggi("Prosegui") <> "0" Then
                        opEsp.Elimina("Prosegui")
                        opTag = opEsp
                    Else
                        Response.Redirect("mobElencoProduzioni.aspx")
                    End If
                Else
                    opTag.Scrivi("", Tag)
                    opTag.Scrivi("DbMaster", dbMaster)
                    opTag.Scrivi("Browse", "MOD")
                End If

                cEsperienze.RegistraEsperienza(ArdesProduzione.Page.Connessione, ArdesProduzione.Page.ConnessioneMasterLift, ArdesProduzione.Page.Utente.UserID, "RicercaQR.aspx", opTag.Leggi(), ArdesProduzione.Page.Cod_Persona)
            End If 'fine gest esperienze per mobile	
ITEM <label class="argomento JS"></label>Il json va in errore:
i caratteri indesiderati sono \n e \t, correggere il testo con 
replace('\n', '\\n').replace('\t', '\\t')			
cfr: https://jsonformatter.curiousconcept.com/
ITEM <label class="argomento JS"></label>
Per avere il testo dell'opzione selezionata in un combobox
$( "#cmb option:selected" ).text();
ITEM <label class="argomento JS"></label> Per chiudere il menu di bo0tstrap 3 quando è aperto e clicco fuori
jQuery('body').bind('click', function (e) {
    if (jQuery(e.target).closest('.navbar').length == 0) {
        // click happened outside of .navbar, so hide
        var opened = jQuery('.navbar-collapse').hasClass('collapse in');
        if (opened === true) {
            jQuery('.navbar-collapse').collapse('hide');
        }
    }
});
ITEM <label class="argomento JS"></label>Font google
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300&display=swap');
ITEM <label class="argomento VB"></label>
Per stampare il messaggio di errore nel global asax posso usare il metodo seguenteSub Application_Error(ByVal sender As Object, ByVal e As EventArgs)
        ' Generato quando si verifica un errore
        'Response.Redirect("Login.aspx")

        Dim sUtente As String = ""
        If ArdesProduzione.Page.Utente IsNot Nothing Then
            sUtente = ArdesProduzione.Page.Utente.UserID
        End If

        Dim oCnn As New CCboConnection(My.Settings.CnnString)
        oCnn.Open()
        If ArdesProduzione.Page.Connessione Is Nothing Then
            
            ArdesProduzioneDLL.cEventi.Registra(oCnn, ArdesProduzione.Page.Utente.UserID, "global_asax", "[SessionID: " & Session.SessionID & "]    " & Server.GetLastError.Message & " - " & Server.GetLastError.InnerException.ToString)

            If oCnn.State = ConnectionState.Open Then oCnn.Close()
            oCnn = Nothing
        Else
            ArdesProduzioneDLL.cEventi.Registra(oCnn, ArdesProduzione.Page.Utente.UserID, "global_asax", "[SessionID: " & Session.SessionID & "]     " & Server.GetLastError.Message & " - " & Server.GetLastError.InnerException.ToString)
            If oCnn.State = ConnectionState.Open Then oCnn.Close()
            oCnn = Nothing
        End If
    End Sub
ITEM <label class="argomento SQL"></label>	
CREATE PROCEDURE ard_errori
AS
  SELECT *
  FROM [ARDES_Produzione].[dbo].[ard_EventiSw]
  WHERE Ambiente = 'global_asax'
  order by Id desc
GO
ITEM <label class="argomento JS"></label>Selettori Jquery:
    var arr = $("input[src*='plus']"); cerco per attributo 'src' che ha nel nome la stringa 'plus'	
ITEM <label class="argomento SQL"></label>
LEAD and LAG functions were first introduced in SQL Server 2012. 
They are window functions.
The LEAD function is used to access data from SUBSEQUENT rows along with data from the current row.
The LAG function is used to access data from PREVIOUS rows along with data from the current row.
An ORDER BY clause is required when working with LEAD and LAG functions, but a PARTITION BY clause is optional.

In sql per restituire il valore della riga precedente:	
SELECT t.Value,
        LAG(t.Value) AS [ValorePrec] OVER (ORDER BY t.ID)
 FROM table AS t
 Utilizzare questa funzione analitica in un'istruzione SELECT (nel WHERE non posso).
ITEM <label class="argomento SQL"></label> 
 Verificare connessioni esistenti aperte su sql 
 SELECT 
    DB_NAME(dbid) as DBName, 
    COUNT(dbid) as NumberOfConnections,
    loginame as LoginName
FROM
    sys.sysprocesses
WHERE 
    dbid > 0
GROUP BY 
    dbid, loginame
ITEM <label class="argomento SQL"></label> 	
Esempio di CREATE e DROP TABLE e di OUTER APPLY (è una join dove mi creo la tabella: in questo modo evito delle
condizioni 'non banali' nella clausola ON...tipo se mi serve solo la prima riga... metto una TOP(1) ed ho fatto)

OSS: non si può usare come rbowin per la browse! al più (credo, ma non ho fatto prove) nella cBrowseToScreen

CREATE table #Persone
(
    CodPersona varchar(10),
	DesPersona varchar(50),
	UtenteWeb varchar(50)
)

INSERT INTO #Persone
	SELECT distinct(Pers.Cod_Persona), Ana.Des_Persona, UtenteWeb
	FROM ARDES_MasterLift.dbo.pre_RepTurPersona Pers
	LEFT JOIN ARDES_MasterLift.dbo.pre_RepTur Turni ON Turni.IdRepTur = Pers.IdRepTur
	LEFT JOIN ARDES_MasterLift.dbo.AnaPersone Ana ON Ana.Cod_Persona =  Pers.Cod_Persona
	WHERE Turni.Giorno = '2022-02-16 00:00:00.000'

SELECT #Persone.CodPersona AS [*Cod_Persona], #Persone.DesPersona, #Persone.UtenteWeb AS [*UtenteWeb],
Prodtempi.*
FROM #Persone
OUTER APPLY(
	SELECT Tempi.IdProduzione AS [*IdProduzione], ProdD.CodFase  AS [*CodFase], ard_TabFasi.DescFase, 
	Tempi.CodCausale AS [*CodCausale],ard_TabCausali.DescCausale, 
	ProdD.CodArt + ' - ' + ProdD.DescArt AS [Articolo], ProdD.QtaProd, Anagra.Ragsoc1 AS [Cliente], ProdD.NumeroLotto AS [Lotto],
	Tempi.OraIni AS [Inizio], Tempi.FlagPausa
	FROM ard_Produzioni_Tempi Tempi 
	LEFT JOIN ard_TabCausali ON ard_TabCausali.CodCausale = Tempi.CodCausale
	LEFT JOIN ard_Produzioni_D ProdD ON ProdD.IdProduzione  = Tempi.IdProduzione
	LEFT JOIN ard_TabFasi ON ard_TabFasi.CodFase = ProdD.CodFase
	LEFT JOIN ARDES.dbo.mas_Anagra Anagra ON Anagra.Codana = ProdD.CodAna
	WHERE Tempi.Utente = #Persone.UtenteWeb
	AND Tempi.DataIni = '2022-02-16 00:00:00.000' 
	AND Tempi .DataFine IS NULL
) Prodtempi

DROP TABLE #Persone;
ITEM <label class="argomento"></label> 
La serie intervento è nella interventi2!
ITEM <label class="argomento VB"></label> 
per cliccare una riga (evento F5) abilitare la modifica
ITEM <label class="argomento VB"></label>
per passare i dati da browse a screen:
	passare solo le chiavi (fa una query per tirare su tutto...). Il click sarà del tipo 
	
	Case System.Windows.Forms.Keys.F5
                Dim pv As New PageValueType

                Dim opTag As New cProprieta
                opTag.Scrivi("BROWSE", "MOD")
                opTag.Scrivi("Codart", m_oGridDBaseFasi.GetRigaSelezionata.Leggi("CodArt"))                
                opTag.Scrivi("CodFase", m_oGridDBaseFasi.GetRigaSelezionata.Leggi("CodFase"))
                opTag.Scrivi("Riga", m_oGridDBaseFasi.GetRigaSelezionata.Leggi("Riga"))
                pv("m_Tag") = opTag.Leggi

                CBO.Web.UI.Page.AddFuturePageValue("~/AssociaFaseproduzione_S.aspx", pv)
                cWindowHelper.Create(Me, "~/AssociaFaseproduzione_S.aspx", , "90%,90%")
	
	IMPORTANTE CI SIA opTag.Scrivi("BROWSE", "MOD") SENNO LA VEDE IN INSERIMENTO E NON TIRA SU NIENTE DAI DATAFIELD!!
	
	NELLA SCREEN: campi iskey = false se modificabili
ITEM <label class="argomento VB"></label> 	
	1) tramite m_oBrowse.keygriglia posso accedere alla query dietro alla griglia 
	----> utile se devo passarla per un report, es:  opParam.Scrivi("SOURCE", m_oBrowse.KeyGriglia)
ITEM <label class="argomento VB"></label> 
	Gestione Tabelle

0) nella Page del progetto aggiungere la properyty
	Public Shared Property GestioneTabelle() As cGestioneTabelle
	....

1) Nel progetto aggiungere la classe MasterPageTabelle (MasterPage nidificata che ha come MasterPage quella classica)

2) Aggiungere le tabelle con il codice corretto (cfr. Query Insert già pronta)
	xxx_ElencoTabelle
	xxx_ElencoTabelle_C
	xxx_ElencoTabelle_D
	xxx_ElencoTabelle_F
	
3) Creare i form:
	frmGestioneTabelle_B.aspx (ha come masterPage quella nuova)
	frmGestioneTabelle_S.aspx (ha come masterPage quella classica)


4) Attenziona alla riga 
lButton.Attributes("href") = "javascript:__doPostBack('ctl00$ctl00$ZZZZZZ$btnMenu_" & Mnu.NomeTabella & "','')" nella MasterPageTabelle.Master.vb

Fare attenzione a mettere in ZZZZZZ il valore presente nella MasterPage nell'ID alla riga
 &lt;asp:ContentPlaceHolder ID="corpo" runat="server"&gt;
Di default c'è content, noi mettiamo corpo o body, tale valore va messo anche al posto di ZZZZZZ e va richiamatao correttamente nella MasterPage nidificata che ho creato
da comunque errore se presente il valore di default e io lo ho cambiato....)


5) Tramite la CboUtility --&gt; Gestione tabelle inserisco i dati
IMPORTANTE: nell'iclassi_sSQL ci va una query del tipo SELECT * FROM TABELLA WHERE CHIAVE = $CHIAVE$,
se non metto il select * ma select con i nomi delle colonne da errore in fase di update!

<img class='ImgAppunti' loading='lazy' src='Immagini\\img4.png'/>
ITEM <label class="argomento VB"></label> Screen come crearla:

LATO HTML
0) mettere nel nome della pagina aspx il suffisso _S
1) i campi per tirare su i valori devono avere tag &lt;cbo:TextBox&gt; o &lt;cbo:DropDownList&gt; o &lt;cbo:RadComboBox
   - in particolare per un textbox mettere nel tag:
	TypeControl="TextBox" TypeData="Text/Data/Numeric" DataField="Lingua" 
	CssClass="form-control" 
   - per una dropdown
   - per un checkbox
   
-----IMPORTANTISSIMO!!!--------------------------------------------------------------------------------------------------------------------
2) Vanno sempre inseriti i campi chiave (passati dalla pagina precedente) e se non necessari metterli nascosti 
|  Importante quindi mettere IsKey="true" per tali campi chiave (che dunque non saranno modificabili) e IsKey="false" per gli altri
|  che voglio poter modificare (IsKey="true" su un campo non chiave va comunque bene per renderelo non modificabile)
|__________________________________________________________________________________________________________________

3) In fondo al form aggiungere i cboButtons (che non si vedono) e i bottoni veri che l'utente clicca:

	a) nel cbobuttons saranno aggiunti dalla libreria i bottoni con ID btnEsci e btnConferma: non usare, nel caso ci siano,
	tali nomi per i bottoni visibili!
	
	&lt;cbo:PlaceHolder ID="cboButtons" runat="server"&gt;&lt;/cbo:PlaceHolder&gt;
	
	b) fisso in fondo aggiungo i pulsanti visbili:
	
	&lt;div id="ButtonsForm" runat="server" style="width:100%; position:fixed; bottom:0px; z-index:1000; background-color:#ececec; border-top:solid 2px #1a64ec;"&gt;
		&lt;div style="height:10px;"&gt;&lt;/div&gt;
		&lt;div class="container" &gt;
			&lt;div class="row"&gt;
				&lt;div class="col col-xs-6 col-md-6 col-lg-6 text-left"&gt;
					&lt;asp:LinkButton ID="btnAnnulla2" runat="server" CssClass="btn btn-default"&gt;&lt;span class="glyphicon glyphicon-chevron-left"&gt;&lt;/span&gt;&nbsp;Torna all'elenco&lt;/asp:LinkButton&gt; 
				&lt;/div&gt;  
				&lt;div class="col col-xs-6 col-md-6 col-lg-6 text-right"&gt;
					&lt;asp:LinkButton ID="btnConferma2" runat="server" CssClass="btn btn-success"&gt;&lt;span class="glyphicon glyphicon-ok"&gt;&lt;/span&gt;&nbsp;Conferma&lt;/asp:LinkButton&gt; 
				&lt;/div&gt;                           
			&lt;/div&gt;
		&lt;/div&gt;         
		&lt;div style="height:5px;"&gt;&lt;/div&gt;
	&lt;/div&gt;
	
	c) in fase di creazione dei textbox, dropdownlist usare i cbo:TextBox/DropDownList
	e usare gli attributi 
		TypeControl="TextBox/comboBox   TypeData="Text/Data"   CssClass="form-control" 
	
LATO VB

0) la pagina deve ovviamente avere in cima

Imports CboUtil.BO
Imports CBO
Imports CboUtil.Data

Public Class ..._S
    Inherits InvatProduzione.Page

1) Dovendo instanziare una screen necessito di una classe per la pagina, cPagina. Creo quindi 
   Private Property m_Pagina As cPagina

2) Nell'INIT

Private Sub Pagina_S_Init(sender As Object, e As EventArgs) Handles Me.Init
        If Not IsPostBack Then

            m_Pagina = New cPagina
            m_Pagina.IClassi_sSql = "SELECT * FROM tabella   WHERE chiave = $chiave$"

        End If

        m_oScreen = New CScreen(enuAppPlatform.Web)
        m_oScreen.F2GraficaWeb = New cF2Grafica
        m_oScreen.Init(Connessione, m_Pagina, Me, SIGLA, "IME")

    End Sub
OSS: attenzione a mettere gli apici esterni ai dollari se la chiave è stringa! '$ChiaveStringa$'
OSS: nell'IClassi_sSql posso usare solo query semplici (senza Join!)
OSS: nell'IClassi_sSql usare query senza specificare database.dbo.nometabela: se mi devo spostare su Master uso la ConnessioneMaster 
	 nell'Init della Screen !!!!

3) Nell'INIT_COMPLETE

Private Sub Pagina_S_InitComplete(sender As Object, e As EventArgs) Handles Me.InitComplete
        Dim btn As CBO.Web.UI.WebControls.Button

        btn = ControlFinder.PageFindControl(Me, "btnEsci")
        If btn IsNot Nothing Then btn.Attributes.Add("style", "display:none")
       
		btnAnnulla2.OnClientClick = "$('#" & btn.ClientID & "').click();return false;"

        btn = ControlFinder.PageFindControl(Me, "btnConferma")
        If btn IsNot Nothing Then btn.Attributes.Add("style", "display:none")
        btnConferma2.OnClientClick = "$('#" & btn.ClientID & "').click();return false;"

    End Sub




4)  Solitamente se non forzo io la screen, i tasti Conferma e Indietro mi riportano (se non ci sono errori) sempre alla browse da cui partivo.
	Nel caso però in cui forzassi tale comportamento (andando a mettere u redirect nell'evento F5 della browse) occorre gestire manualmente 
	il redirect alla browse a seguito del click dei cbobuttons:

Indietro	Case System.Windows.Forms.Keys.Escape
                Response.Redirect(PageValue("m_ReturnUrl"))
Conferma	Private Sub m_oScreen_AfterUPDATE(ByRef p_Dati As cProprieta) Handles m_oScreen.AfterUPDATE
				Response.Redirect(PageValue("m_ReturnUrl"))				

ITEM <label class="argomento VB"></label> Screen con btn modifica:
Style ImpiantoAnagrafica

LATO vb
screen classica ma con qualche accorgimento: 

    Private Sub ViaggiRiepilogoCosti_S_Init(sender As Object, e As EventArgs) Handles Me.Init
        If Not IsPostBack Then
            Dim opTag As New cProprieta
            opTag.Scrivi("", Tag)
            opTag.Scrivi("IdViaggio", m_IdViaggio)
			
---------&gt;  opTag.Scrivi("BROWSE", "View")  'BROWSE può essere solo INS o MOD. imposto "View" così faccio comportare la screen come voglio io            
            Tag = opTag.Leggi

            m_Viaggi = New cViaggio
            m_Viaggi.IClassi_sSql = "SELECT * FROM tng_Viaggi WHERE IdViaggio = $IdViaggio$"
        End If

        m_oScreen = New CBO.CScreen(CBO.enuAppPlatform.Web)
        m_oScreen.F2GraficaWeb = New cF2Grafica
---------&gt;      m_oScreen.Init(Connessione, m_Viaggi, Me, "tng", "IE")    &lt;--------- IE in modo crei il btnModifica

    End Sub

    Private Sub ViaggiRiepilogoCosti_S_InitComplete(sender As Object, e As EventArgs) Handles Me.InitComplete
        Dim btn As CBO.Web.UI.WebControls.Button

        btn = ControlFinder.PageFindControl(Me, "btnEsci")
        If btn IsNot Nothing Then btn.Attributes.Add("style", "display:none")

        btnAnnulla2.OnClientClick = "$('#" & btn.ClientID & "').click();return false;"

        btn = ControlFinder.PageFindControl(Me, "btnConferma")
        If btn IsNot Nothing Then btn.Attributes.Add("style", "display:none")
        btnConferma2.OnClientClick = "$('#" & btn.ClientID & "').click();return false;"

 ---------&gt;      'button modifica
 ---------&gt;      btn = ControlFinder.PageFindControl(Me, "btnModifica")
 ---------&gt;      If btn IsNot Nothing Then
 ---------&gt;         btn.Style.Add("display", "none")
 ---------&gt;          btnModificaDettagli.OnClientClick = "ShowLoading();$('#" & btn.ClientID & "').click();return false;"
 ---------&gt;       End If

    End Sub
	
LATO ASPX

Aggiungo il mio btn per modificare la screen
&lt;asp:LinkButton ID="btnModificaDettagli" runat="server" CssClass="btn btn-default"&gt;&lt;span class="glyphicon glyphicon-pencil"&gt;&lt;/span&gt;&nbsp;Modifica&lt;/asp:LinkButton&gt; 	
ITEM <label class="argomento VB"></label> 
Aprire la screen in un form dialog:

 Private Sub m_oBrowse_FCODE(ByRef keyPress As Integer, ByRef shift As Integer) Handles m_oBrowse.FCODE
        Select Case keyPress
            Case System.Windows.Forms.Keys.F5

                keyPress = 0
                Dim pTag As New cProprieta
                pTag.Scrivi("Browse", "MOD")
                pTag.Scrivi("Codice", m_oBrowse.GetRigaSelezionata.Leggi("Lotto"))

                Dim pv As New PageValueType
                pv.Add("Tag", pTag.Leggi)
                pv.Add("ReturnUrl", "")

                AddFuturePageValue("~/FormDialog/RicezioneMerce_S.aspx", pv)
                cWindowHelper.Create(Me, "~/FormDialog/RicezioneMerce_S.aspx", "document.forms[0].submit();", "90%,90%")
ITEM <label class="argomento VB"></label> Nella table td sta per "table data"
ITEM <label class="argomento VB"></label> 
	divAttivita.Attributes.Add("style", "display:block")
    divAttivita.Attributes.CssStyle("display") = "block"
ITEM <label class="argomento VB"></label> 	
Nella IClassi_Read per accodare altri campi a quelli che già ci sono:

	Dim m_StringaProprieta As New cProprieta
	cDBUtility.DB_Read(connessione, "SELECT AnaPersone.* FROM AI_Interventi LEFT JOIN AnaPersone ON AnaPersone.CodChiamatista = AI_Interventi.Chiamatista  WHERE  Codice = " & IClassi_Proprieta.Leggi("Codice"), m_StringaProprieta)
	m_StringaProprieta.Elimina("AggID") 'elimino l'AggID nuovo           

	'importo tutto lo stringone (non ci sono campi "uguali")
	IClassi_Proprieta.Scrivi("", CboUtil.BO.cFunzioni.ImpostaCProprietaToCProprieta(IClassi_Proprieta.Leggi, m_StringaProprieta.Leggi))	
	
	!!!Attenzione che non ci siano campi con gli stessi nomi tra la tabella 'base' e quella 'nuova', nal caso usare degli alias!!!
ITEM <label class="argomento SQL"></label> 
Nuovo modo di fare le query
DECLARE @CodAna as varchar(20)
DECLARE @CodImp as varchar(20)
DECLARE @CompensoPerc as numeric(18,2)
DECLARE @CompensoImp as numeric(18,2)
DECLARE @CodPersona as numeric(18,2)
DECLARE @CodChiamatista as numeric(18,0)
DECLARE @CodInt as numeric(18,2)
DECLARE @CodAmm as varchar(20)

SET @CodInt = '$CodInt$'
SET @CodImp = (SELECT impianto FROM ai_interventi WHERE codice = @CodInt)
SET @CodAna = (SELECT Utente FROM AI_Impianti WHERE Codice = @CodImp)
SET @CodChiamatista = (SELECT Chiamatista FROM ai_interventi WHERE codice = @CodInt)
SET @CodAmm = (SELECT Amministratore FROM AI_Impianti WHERE codice = @CodImp)

SET @CodPersona = (SELECT Cod_Persona FROM AnaPersone WHERE CodChiamatista =@CodChiamatista)

BEGIN
	IF LEN(@CodImp) > 0
		IF (EXISTS(SELECT CompensoPerc FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodImp = @CodImp)) OR (EXISTS(SELECT CompensoImp FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodImp = @CodImp))
			BEGIN
			SET @CompensoPerc = (SELECT CompensoPerc FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodImp = @CodImp)			
			SET @CompensoImp = (SELECT CompensoImp FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodImp = @CodImp)
			END
		ELSE 
			IF (EXISTS(SELECT CompensoPerc FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodAna = @CodAna))  OR (EXISTS(SELECT CompensoImp FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodAna = @CodAna))
				BEGIN
				SET @CompensoPerc = (SELECT CompensoPerc FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodAna = @CodAna)
				SET @CompensoImp = (SELECT CompensoImp FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodAna = @CodAna)
				END
			ELSE 
				IF (EXISTS(SELECT CompensoPerc FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodAmm = @CodAmm)) OR (EXISTS(SELECT CompensoImp FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodAmm = @CodAmm))
					BEGIN
					SET @CompensoPerc = (SELECT CompensoPerc FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodAmm = @CodAmm)
					SET @CompensoImp = (SELECT CompensoImp FROM cer_TabCompensi WHERE CodPersona = @CodPersona AND CodAmm = @CodAmm)
					END
				ELSE  
					BEGIN
					SET @CompensoPerc = (SELECT CompPerc FROM AnaPersone WHERE Cod_Persona = @CodPersona)
					SET @CompensoImp = (SELECT CompImp FROM AnaPersone WHERE Cod_Persona = @CodPersona)
					END		
END

SELECT @CodAna as CodAna, @CodPersona as CodPersona, @CompensoPerc as CompensoPerc, @CompensoImp as CompensoImp
ITEM <label class="argomento VB"></label> 
Non apre il form dialog: manca un KeyPress = 0 nel select

ITEM <label class="argomento VB"></label> 
somma colonne nella vwindef
        '---Footer e totali
        m_GrigliaWeb.MasterTableView.ShowFooter = True

        CType(m_GrigliaWeb.Columns.FindByDataField("Carico"), GridBoundColumn).Aggregate = GridAggregateFunction.Sum
        CType(m_GrigliaWeb.Columns.FindByDataField("Carico"), GridBoundColumn).FooterText = " "
        CType(m_GrigliaWeb.Columns.FindByDataField("Carico"), GridBoundColumn).FooterStyle.HorizontalAlign = HorizontalAlign.Right
        CType(m_GrigliaWeb.Columns.FindByDataField("Carico"), GridBoundColumn).FooterStyle.ForeColor = Drawing.Color.Violet

        CType(m_GrigliaWeb.Columns.FindByDataField("Scarico"), GridBoundColumn).Aggregate = GridAggregateFunction.Sum
        CType(m_GrigliaWeb.Columns.FindByDataField("Scarico"), GridBoundColumn).FooterText = " "
        CType(m_GrigliaWeb.Columns.FindByDataField("Scarico"), GridBoundColumn).FooterStyle.HorizontalAlign = HorizontalAlign.Right
        CType(m_GrigliaWeb.Columns.FindByDataField("Scarico"), GridBoundColumn).FooterStyle.ForeColor = Drawing.Color.Red

        CType(m_GrigliaWeb.Columns.FindByDataField("Totale"), GridBoundColumn).Aggregate = GridAggregateFunction.Sum
        CType(m_GrigliaWeb.Columns.FindByDataField("Totale"), GridBoundColumn).FooterText = " "
        CType(m_GrigliaWeb.Columns.FindByDataField("Totale"), GridBoundColumn).FooterStyle.HorizontalAlign = HorizontalAlign.Right
        CType(m_GrigliaWeb.Columns.FindByDataField("Totale"), GridBoundColumn).FooterStyle.ForeColor = Drawing.Color.Green
        CType(m_GrigliaWeb.Columns.FindByDataField("Totale"), GridBoundColumn).ItemStyle.ForeColor = Drawing.Color.Transparent
		'IMPORTANTE: SE AVESSI COLONNE NASCOSTE CON * o DA CWINDEF DEVO NASCONDERE ANCHE IL FOOTER!
		m_GrigliaWeb.Columns.FindByDataField("*IdViaggio").FooterStyle.CssClass = "nascosto" 

        CType(m_GrigliaWeb.Columns.FindByDataField("Anno"), GridBoundColumn).FooterText = "TOTALI: "
		
ITEM <label class="argomento VB"></label> 
Non tira su la chiave nella screen: passo il nome del tag sbagliato!	

ITEM <label class="argomento VB"></label> 
Non va la grafica dell'F2:
-manca la properyty
-non viene istanziata la property-
-non aggiungo la properyt	
ITEM <label class="argomento VB"></label> 
Stoppare click funzione dal VB: fare 
btn.OnClientClick = "if(MetodiJS()){return false;}"
così non passa sicuro nel click vb.net
ITEM <label class="argomento VB JS"></label> 
Impostare data massima
    //gestione data: imposto la data massima ad oggi sul datepicker

    var opDate = new cProprieta();
    opDate.Scrivi('', callWebService('Sinistri.svc', 'GetDate', '{ "token" : "' + localStorage['MBE_Token'] + '" }'));
    var giorno = opDate.Leggi('Data');
    
    $('#txtDataSinistro').attr('max', giorno);
    //disabilito la scrittura manuale di date posteriori ad oggi
    $('#txtDataSinistro').change(function () {
        var op = new cProprieta();
        
        // Disabilito l'inserimento manuale di date posteriori a quella massima 
        var dataMax = new Date($('#txtDataSinistro').attr('max'));
        var dataImp = new Date($('#txtDataSinistro').val());
        if (dataImp > dataMax) {
            $('#txtDataSinistro').val('');
        }
    });
ITEM <label class="argomento SQL"></label> 
Restore database grandi
SELEZIONARE il PATH per il ripristino in T:\DbSql\
scrivendo sia per il file .MDF si per il .LDF i percorsi, esempio:

T:\DbSql\ARDES.MDF
T:\DbSql\ARDES_1.LDF
ITEM <label class="argomento VB"></label> 
Se devo richiamare un WS da codice devo 

1. lanciare il WS e scrivermi l'indirizzo su cui gira
2. andare nel MyProject -> Riferimenti -> scrivere l'indirizzo/NomeDelProgettoWS nel riferimento SERVICE
ITEM <label class="argomento VB"></label> 
C# e Xamarin: roba varia

Su Xamarin non va il debug ---> sono in modalità Release anzichè Debug!
Visual studio non vede il dispositivo collegato: eseguire Visual Studio come amministratore!
 C# - dichiarazione variabili:
var name = "C# Corner"; // Implicitly typed.  
string name = "C# Corner"; // Explicitly typed. => type variableName = value;
 C# - Property
	string sPathDownload = "";
	public string mPathDownload { get => sPathDownload; set => sPathDownload = value; }

Nell'interfaccia scrivo invece
	string mPathDownload { get; set; }
	
	
	jQuery('body').bind('click', function(e) {
    if(jQuery(e.target).closest('.navbar').length == 0) {
        // click happened outside of .navbar, so hide
        var opened = jQuery('.navbar-collapse').hasClass('collapse in');
        if ( opened === true ) {
            jQuery('.navbar-collapse').collapse('hide');
        }
    }
});
ITEM <label class="argomento SQL"></label> 
Aggiungere un nuovo bottone personalizzabile cliccabile nella cwindef (che ne clicca uno della browse):
	Dim idBtnAnnulla As String = item("colbtnAnnulla").Controls(0).ClientID
	Dim imgAnnulla As New ImageButton
	
	imgAnnulla.ID = "btn" & idBtnAnnulla
	imgAnnulla.ImageUrl = "~/Images/Comuni/annulla.png"
	imgAnnulla.Attributes.Add("onclick", "$('#" & idBtnAnnulla & "').click(); return false;")
	
	item("CodStatoLavaggio").Controls.Add(imgAnnulla)
	item("CodStatoLavaggio").Controls.Clear()
(OSS: quando aggiungo un imgbutton nella browse la colonna prende il nome di 'btn' + il nome del bottone che creo	
ITEM <label class="argomento JS CSS"></label> 
Mettere un'immagine in fono alla pagina centrata
	&lt;div class="col-xs-12" style="text-align: center; position: absolute; bottom: 20px; left:0"&gt;                                       
			&lt;label style="font-size: 18px; font-style: italic; padding-top: 40px;"&gt;Powered by&lt;/label&gt;&lt;br /&gt;                       
			&lt;img src="..." style="height: auto; max-width: 180px; " /&gt;
	&lt;/div&gt;

ITEM <label class="argomento VB"></label>
Per modificare lo stato di una grigli da classica a MultiSelezione:
1)
    Public Shared Property m_ModalitaSelezMult As Boolean
        Get
            Return cFunzioni.Nz(PageValue("m_ModalitaSelezMult"), False)
        End Get
        Set(value As Boolean)
            PageValue("m_ModalitaSelezMult") = value
        End Set
    End Property

    Private Shared Property m_CambioVisualizzazione As Boolean
        Get
            Return cFunzioni.Nz(PageValue("m_CambioVisualizzazione"), False)
        End Get
        Set(value As Boolean)
            PageValue("m_CambioVisualizzazione") = value
        End Set
    End Property
	
	Public Shared Property m_ClickMultiSel As Boolean
        Get
            Return cFunzioni.Nz(PageValue("m_ClickMultiSel"), False)
        End Get
        Set(value As Boolean)
            PageValue("m_ClickMultiSel") = value
        End Set
    End Property
	
2)
    Private Sub cerInterventoCompensi_B_Init(sender As Object, e As EventArgs) Handles Me.Init
        If m_CambioVisualizzazione Then
            m_CambioVisualizzazione = False                  
            Response.Redirect(Path)
        End If

        If Not IsPostBack Then
            'verifica autorizzazione apertura
            If Not Autorizzazioni.ApriForm Then
                Autorizzazioni.ErroreApriForm = True
                Response.Redirect(Request.ServerVariables("HTTP_REFERER"))
            End If
            m_Compensi = New cInterventi
            m_Compensi.IClassi_sSql = "SELECT * FROM AI_Interventi WHERE Codice = $Codice$"
            m_WinDef = New cWinDef(IWinDef.enuAppPlatform.Web)
        End If

        m_oBrowse = New CBO.CBrowse(CBO.enuAppPlatform.Web)
        CBO.Web.Bootstrap.cGridFilterAll.AbilitaFiltroAll(grdGriglia, Telerik.Web.UI.GridCommandItemDisplay.Top, CBO.Web.Bootstrap.cGridFilterAll.enuEspandiFiltro.Espandi)

        If m_ModalitaSelezMult = True Then
            'gestisco proprietà cwindef
            m_WinDef.Parametri.Scrivi("MULTISELEZIONE", "1")
            m_WinDef.Parametri.Scrivi("MULTISELEZIONE_COLONNE_CHIAVE", "*Codice")

            m_oBrowse.WinDef = m_WinDef
            m_oBrowse.Init(m_Compensi, Connessione, Me, "cer", "", "IME")
        Else
            m_oBrowse.WinDef = m_WinDef
            m_oBrowse.ImgButtonEliminaWeb = "~/Images/btnElimina.png"
            m_oBrowse.Init(m_Compensi, Connessione, Me, "cer", "", "IE")
        End If

        If Not IsPostBack Then RiempiGriglia()
    End Sub

3) Nell'FCODE

	Case System.Windows.Forms.Keys.F10
		RiempiGriglia()


		If m_ClickMultiSel Then
			m_ClickMultiSel = False 'passo qui solo dopo aver cliccato sul btnImpostaMulti

4) Nell'html
&lt;asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server"&gt;
	&lt;link href="Css/bootstrap-toggle.min.css" rel="stylesheet" /&gt;
    &lt;script src="Scripts/bootstrap-toggle.min.js"&gt;&lt;/script&gt;
	
IMPORTATE CHE SIA NEL CONTENT, SENNO NON FUNZIONA CORRETTAMENTE	
	...
	
	 &lt;td&gt;
		&lt;asp:Panel id="pModalita" runat="server"  style="margin-top:-20px"&gt;
			&lt;small&gt;&lt;br /&gt;&lt;/small&gt;
			&lt;asp:CheckBox ID="chkModalita" runat="server" style="padding-bottom:5px"/&gt;			   
		&lt;/asp:Panel&gt; 
	&lt;/td&gt;
	&lt;td&gt;
		&lt;asp:LinkButton ID="btnIncaricaMulti" runat="server" CssClass="btn btn-primary" Width="110" OnClientClick="ShowLoading();"&gt;
			&lt;span class="glyphicon glyphicon-th-list"&gt;&lt;/span&gt; Incarica
		&lt;/asp:LinkButton&gt;
	&lt;/td&gt;	
	
5)	
&lt;System.Web.Services.WebMethod()&gt; _
    Public Shared Function SetModalita(ByVal bModalita As Boolean) As String
        m_ModalitaSelezMult = bModalita
        m_CambioVisualizzazione = True
        Return ""
    End Function	

6)  Private Sub btnImpostaMulti_Click(sender As Object, e As EventArgs) Handles btnImpostaMulti.Click
        m_ClickMultiSel = True
        m_oBrowse.PremiButton(System.Windows.Forms.Keys.F10)
    End Sub
	
7) Nel ready js:

	//selettore modalità
	$('#ctl00_body_chkModalita').bootstrapToggle({
        on: 'Passa a Modalità Elenco',
        off: 'Passa a Modalità Incarico',
        width: '220px',
        onstyle: 'primary',
        offstyle: 'info'
    });
	
    $('#ctl00_body_chkModalita').change(function () {        
        eseguiPageMethod('cerPianificazioneVisite_B.aspx', 'SetModalita', '{ "bModalita" : "' + $(this).is(":checked") + '" }');
        ShowLoading();
        __doPostBack('ctl00$body$btnFiltra', '');
    });	

8) Nel prerender	
	 chkModalita.Checked = m_ModalitaIncarico

ITEM <label class="argomento VB"></label>
Quando faccio 
        m_oBrowse.AddImgButtonGrigliaWeb("btnInviaOMZ", ...)

aggiunge un acolonna di nome <i>colbtnInviaOMZ</i>

per accedere l'ID client della colonna dalla cWinDef:
item("colbtnInviaOMZ").Controls(0).ClientID
	
ITEM <label class="argomento VB"></label> 	
	XCP
	Evento XCP: scatenato quando il campo di testo perde il fuoco 
se nel textbox ho XCPconPost="true"
ITEM <label class="argomento VB"></label>  Per visualizzare gli errori, nel web.config mettere nel tag 
&lt;system.web&gt;
	&lt;customErrors mode="Off"/&gt;
&lt;/system.web&gt;

ITEM <label class="argomento VB"></label> 
Quando si fa il scarica excel nel path da dato anche il nome del file!!!
  nella cbo_CFG posso metetre il nome del localhost del ws
ITEM <label class="argomento VB"></label> 
  per scaricare un file posso fare window.href = pathFile

ITEM <label class="argomento VB"></label> 
  click btn js con timeout per mostarre caricamento

    setTimeout(function () {

        let op = new cProprieta();
        op.Scrivi('', callWebService('Intervento.svc', 'ScaricaRapportini', '{ "sToken" : "' + localStorage['MIA_Token'] + '", "sParam" : "' + opFiltri.Leggi('') + '"}'));
        $('.se-pre-con').css('display', 'none');
        if (op.Leggi("zipPath") != '') {
            window.location.href = op.Leggi("zipPath");
        } else {
            alert('Anomalia in fase di download cartella')
        }

    }, 1000)
	
	
	5) ag checkbox  tipo HR
	agg riferimenti
	&lt;link href="FontAwesome/css/font-awesome.min.css" rel="stylesheet" /&gt;
    &lt;link href="css/CheckboxBootstrap.css" rel="stylesheet" /&gt;
	
	HTML a runtime:
	 strHTML += '&lt;div class="col-xs-3"&gt;&lt;span class="checkbox" onblur="LostFocus(this);" onfocus="GotFocus(this);"&gt;'
            strHTML += '&lt;input id="chk' + codice + '"  type="checkbox" checked="checked"&gt;'
            strHTML += '&lt;label for="chk' + codice + '" style="font-size:16px;"&gt;&nbsp;' + desc + '&lt;/label&gt;&lt;/span&gt;'
            strHTML += '&lt;/div&gt;'
			
			    let strHTML = '&lt;select id="cmbTipoImp" class="form-control"&gt;';
    strHTML += '&lt;option value=""&gt;&lt;/option&gt;';
    if (opTipoImp.Leggi('ERRORE') == '')
    {
        //ciclo il cProprieta
        
        for (i = 1; i &lt;= op.Count() ; ++i) {
            let nomeTag = op.nomeProprieta(i);
            let valore = op.Leggi(nomeTag);
            if (nomeTag != 'ERRORE') {
                strHTML += '&lt;option value="' + valore + '"&gt;' + nomeTag + '&lt;/option&gt;';
            }
        }
        strHTML += '&lt;/select&gt;';
       

        $('#divTipoImp').append(strHTML);

    } else {
        alert('anomalia in fase creazione menu Tipo Impianto')
    }
	
	(https://api.jquery.com/jquery.each/)
Voglio ciclare certi input cui ho associato la classe inpPF

devo usare $(this) per richiamare l'elemento su cui sono

è possibile passare alla function qualche parametro (es. function(obj) e poi uso obj.id in seguito),
ma non sono riuscito a capire come

$('.inpPF').each(function () {               
	if ($(this).val() == '') {
		...
	}
});


OSS: The $.each() function is not the same as $(selector).each(), which is used to iterate, exclusively, over a jQuery object. 
The $.each() function can be used to iterate over any collection, whether it is an object or an array. 
In the case of an array, the callback is passed an array index and a corresponding array value each time. 
(The value can also be accessed through the this keyword, but Javascript will always wrap the this value as an Object even if it is a simple 
string or number value.) The method returns its first argument, the object that was iterated.

PreventDoubleClick(){
$('.btnPulsanteGestioneFaseMobile').attr('disabled', true).attr('onclick', 'return false;');
setTimeout(function(){
	$('.btnPulsanteGestioneFaseMobile').attr('disabled', false).removeAttr('onclick')
	}, 500)
}
ITEM <label class="argomento VB"></label>
1) per creare link per aprire da fuori il programma:

Dim sUserId As String = cFunzioni.Nz(cDBUtility.DLookUp(connessione, "UtenteWeb", "AnaPersone", "Cod_Persona='" & r("Cod_Persona") & "'"), "")
Dim sPassword As String = cFunzioni.Nz(cDBUtility.DLookUp(connessione, "PasswordWeb", "AnaPersone", "Cod_Persona='" & r("Cod_Persona") & "'"), "")

Dim opParam As New cProprieta
opParam.Scrivi("UserId", sUserId)
opParam.Scrivi("Password", sPassword)
opParam.Scrivi("Pagina_aspx", "cerPianificazioneVisite_B.aspx")
opParam.Scrivi("m_Filtro", "...")

Dim sLink As String = MasterCertDLL.cParametri.rilparT("$HR", connessione)
If Right(sLink, 1) <> "/" Then sLink += "/"
sLink += "cerLogin.aspx?cboValue=" & HttpUtility.UrlEncode(cCryptography.EncryptTo3DES(opParam.Leggi, CBO.Comune.CRYPTKEY))

CBO.cWindowHelper.Create(Me.Page, sLink, "")

2) Nella pagina Login.aspx aggiungere il case della pagina in 
	Select Case strPagina
		Case "cerPianificazioneVisite_B.aspx"
			pv = New PageValueType
			pv("m_Filtro") = oP.Leggi("m_Filtro")
ITEM <label class="argomento VB"></label> Query di pulizia varie
certifor clear email data

UPDATE [CERTIFOR_Masterlift].[dbo].[AnaPersone] SET LavoroEmail = ''
UPDATE AI_Amministratori SET EmailFattura = ''
UPDATE [Amministratori2] SET EMail = ''
UPDATE [CERTIFOR_Masterlift].[dbo].[AnaPersone] SET [LavoroEmail] = ''
UPDATE [CERTIFOR_Masterlift].[dbo].[AnaPersoneDati] SET [EMail] = ''
UPDATE [CERTIFOR_Masterlift].[dbo].[kai_AmministratoriTelefoni] SET email = ''

UPDATE mas_Sedi SET Email = ''
UPDATE mas_Anagra SET Mail = ''
UPDATE mas_Telefoni SET email = ''
ITEM <label class="argomento VB"></label> 
Errore system.servicemodel.serviceactivationexception:
non è stato commentato/scommentato in HTTPS il pezzo di webconfig necessario!
ITEM <label class="argomento VB"></label> 
Non scatena l'afterUpdate ---> ha dato errore l'update classico della screen
ITEM <label class="argomento VB"></label> Nella browse/Browsetoscreen per nascondere il footer della griglia m_oGridFasiInCorso.Griglia.ShowFooter = False
ITEM <label class="argomento VB"></label> Il Report non funziona correttamenete (non tira su i campi): Filter compilato a blank (equivale a 1<>1)		
ITEM <label class="argomento VB"></label> Esempio split in VB.NET
Dim oLavaggio As New cLavaggi(oLav)
oLavaggio.IClassi_sSql = "SELECT * FROM tnk_MovimentiDett WHERE AnnoMov = '$AnnoMov$' AND NumMov = $NumMov$ "
Dim op As New cProprieta
Dim sAnnoMov, sNummov As String
sAnnoMov = oLavaggio.ID_FASCICOLOLEO.Split("-")(0)
sNummov = oLavaggio.ID_FASCICOLOLEO.Split("-")(1)
ITEM <label class="argomento VB JS"></label> Gestione timer refresh:
TIMER Refresh
ASPX
&lt;asp:Panel ID="pDataRif" runat="server" DefaultButton="btnAggiorna"&gt;
            &lt;table border="0" style="width: 100%"&gt;
                &lt;tr&gt;
                    &lt;td style="text-align:left;"&gt;
                            &lt;asp:Label runat="server" ID="lblVersione"&gt;&lt;/asp:Label&gt;
                    &lt;/td&gt;
                    &lt;td style="text-align:right; padding-right:20px;"&gt;
                        &lt;asp:LinkButton ID="btnAggiorna" CssClass="btn btn-primary" runat="server"&gt;&lt;span class="glyphicon glyphicon-refresh"&gt;&lt;/span&gt; Aggiorna&lt;/asp:LinkButton&gt;
                    &lt;/td&gt;
                    &lt;td id="tdRefresh" runat="server" class="text-right-xs hidden-xs hidden-sm" style="width: 170px"&gt;
                        &lt;small&gt;Next&nbsp;&lt;/small&gt;&lt;asp:Label ID="lblRefreshSecondi" runat="server" style="font-size:12pt"&gt;&lt;/asp:Label&gt;&lt;small&gt;&nbsp;sec&lt;/small&gt;
                        &lt;asp:LinkButton ID="btnRefreshPausa" runat="server" CssClass="btn btn-default" OnClientClick="return false;" ToolTip="Interrompi aggiornamento automatico della pagina"&gt;&lt;span class="glyphicon glyphicon-pause"&gt;&lt;/span&gt;&lt;/asp:LinkButton&gt;                            
                        &lt;asp:LinkButton ID="btnRefreshPlay" runat="server" CssClass="btn btn-default" OnClientClick="return false;" ToolTip="Avvia aggiornamento automatico della pagina"&gt;&lt;span class="glyphicon glyphicon-play"&gt;&lt;/span&gt;&lt;/asp:LinkButton&gt;
                    &lt;/td&gt;
                    &lt;td id="tdSegnalazioneAnomalia" runat="server" class="text-right-xs hidden-xs hidden-sm" style="width: 30px"&gt;                                                
                        &lt;div id="divSegnalazioneAnomalia" runat="server" style="border:solid 1px #ffffff; border-radius:100%; height:25px;width:25px;"&gt;&lt;/div&gt;
                    &lt;/td&gt;
                    &lt;td class="visible-xs hidden-sm hidden-md hidden-lg"&gt;&nbsp;&lt;/td&gt;
                &lt;/tr&gt;
            &lt;/table&gt;
        &lt;/asp:Panel&gt;

VB
	Private Sub btnAggiorna_Click(sender As Object, e As EventArgs) Handles btnAggiorna.Click
        m_oBrowse.PopolaGriglia()
    End Sub
	
JAVACSRIPT
var timer;
var pause;
var lockTimer = 0;
var TimeOut;

$(document).ready(function () {
    ImpostaTimer('');
});

function setRefresh() {
    clearTimeout(TimeOut);
    TimeOut = setTimeout(function () {
        var menuOpen = false;
        if ($('.dropdown').find('.dropdown-menu').is(":visible")) { menuOpen = true; }
        if ($('.overlay').css('display') == 'block') { menuOpen = true; }

        if (pause == false && timer > 0 && lockTimer == 0) {
            timer = timer - 1;
            $('#ctl00_corpo_lblRefreshSecondi').html(timer);
        }

        if (timer == 0) {
            javascript: __doPostBack('ctl00$corpo$btnRefreshPanel', '')
            ImpostaTimer('');
        }
        else {
            setRefresh();
        }
    }, 1000);
}

function ImpostaTimer(t) {
    $('input[disabled="disabled"]').each(function () {
        $(this).prop('disabled', false)
    });

    $('#ctl00_corpo_btnRefreshPausa').attr('href', '');
    $('#ctl00_corpo_btnRefreshPlay').attr('href', '');

    if (t == ''){
        timer = parseInt($('#ctl00_corpo_lblRefreshSecondi').html());    
    }else{
        timer = parseInt($('#ctl00_corpo_lblRefreshSecondiDefault').html());    
    }

    pause = false;
    $('#ctl00_corpo_btnRefreshPausa').attr('class', 'btn btn-default');
    $('#ctl00_corpo_btnRefreshPlay').attr('class', 'btn btn-default disabled');

    setRefresh();
}

function Pausa() {
    pause = true;
    $('#ctl00_corpo_btnRefreshPlay').attr('class', 'btn btn-default');
    $('#ctl00_corpo_btnRefreshPausa').attr('class', 'btn btn-default disabled');
}

function Play() {
    pause = false;
    $('#ctl00_corpo_btnRefreshPausa').attr('class', 'btn btn-default');
    $('#ctl00_corpo_btnRefreshPlay').attr('class', 'btn btn-default disabled');
}

ITEM <label class="argomento VB"></label> Gestione cartella Tmp/#Region "Gestione cartella TMP" e metodo per cancellare ricorsivamente una cartella che contiene filechooser
(non posso eliminare una acrtella conetnenete file, System.IO.Directory.Delete darebbe errore!)
    Public Shared Function GeneraCartellaTmp(ByVal user As String) As String
        Dim strBuilder As StringBuilder = New StringBuilder()
        Dim rnd As New Random
        Dim ch As Char
        Dim sPathTemp As String = ""

        Try
            'Paolo: commentato 20-12-21
            'For i As Integer = 0 To 6
            '    ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * rnd.NextDouble() + 65)))
            '    strBuilder.Append(ch)
            'Next

            'verifico cartella temp
            sPathTemp = HttpContext.Current.Request.PhysicalApplicationPath
            If Right(sPathTemp, 1) <> "\" Then sPathTemp += "\"
            sPathTemp += "Temp\"

            If System.IO.Directory.Exists(sPathTemp & user) Then
                'System.IO.Directory.Delete(sPathTemp, True) 'commentato perche da errore (ma non in debug): uso invece questo metodo 
                DeleteDirectory(sPathTemp & user)
            Else
                System.IO.Directory.CreateDirectory(sPathTemp & user)
            End If

            'creo cartella Tmp
            sPathTemp += user & "\"
            If Not System.IO.Directory.Exists(sPathTemp) Then System.IO.Directory.CreateDirectory(sPathTemp)

        Catch ex As Exception
            Comune.RegistraEvento(cFunzioni.CboAppSetting("Application"), "SERVICE", "Comune.GeneraCartella", "Errore: " & ex.Message)
        End Try

        Return sPathTemp
    End Function

    ' <summary>
    ' Depth-first recursive delete, with handling for descendant 
    ' directories open in Windows Explorer.
    ' </summary>
    Public Shared Sub DeleteDirectory(ByVal path As String)
        For Each directory As String In System.IO.Directory.GetDirectories(path)
            DeleteDirectory(directory)
        Next

        Try
            System.IO.Directory.Delete(path, True)
        Catch __unusedIOException1__ As System.IO.IOException
            System.IO.Directory.Delete(path, True)
        Catch __unusedUnauthorizedAccessException2__ As UnauthorizedAccessException
            System.IO.Directory.Delete(path, True)
        End Try
    End Sub
#End Region

ITEM <label class="argomento VB"></label> 
Creare al volo nuovo impianto ed evadere chiamata su di esso:
1) Menu tecnico
2) ricerca impianto
3) nuovo impianto (qui è tirato su il dettaglio dell'impianto con codice fisso 9999)
4) nuova chiamata
5) conferma --> errore: va avviata
6) menu tecnico --> evasione rapida
ITEM <label class="argomento VB"></label> 
Aprire screen da F5

Private Sub m_oBrowse_FCODE(ByRef KeyPress As Integer, ByRef Shift As Integer) Handles m_oBrowse.FCODE
        Select Case KeyPress
            Case System.Windows.Forms.Keys.F5
                Dim a As String = ""

                Dim opTag As New cProprieta
                opTag.Scrivi("", Tag)
                opTag.Scrivi("CODCATSOSTANZE", m_oBrowse.GetRigaSelezionata.Leggi("CODCATSOSTANZE"))    'passo le chiavi della screen            
                opTag.Scrivi("BROWSE", "MOD")															'da specificare (entra in INS di default)
                opTag.Scrivi("ReturnUrl", "~/frmListiniPrezzi_B.aspx")									'per gestire il btnAnnulla, sa passo dalla browse lo fa di default
                Tag = opTag.Leggi()

                Dim pv As New PageValueType
                pv = PageValue()
                pv("Tag") = Tag

                AddFuturePageValue("~/frmListiniPrezzi_S.aspx", pv)
                Response.Redirect("frmListiniPrezzi_S.aspx")

            Case System.Windows.Forms.Keys.F10
                RiempiGriglia()
        End Select
    End Sub
ITEM <label class="argomento VB"></label>	
Per gestire la somma in fondo alle browse/cBrowseToScreen devo fare nella cWinDef:

	m_GrigliaWeb.MasterTableView.ShowFooter = True
	CType(m_GrigliaWeb.Columns.FindByDataField("ColonnaInCuiVoglioLaScrittaTotale"), GridBoundColumn).FooterText = "Totale"
	CType(m_GrigliaWeb.Columns.FindByDataField("CostoMacchina"), GridBoundColumn).Aggregate = GridAggregateFunction.Sum	
	CType(m_GrigliaWeb.Columns.FindByDataField("CodStrumentazione"), GridBoundColumn).FooterText = " " 'onde evitare scriva "Sum:"	
	CType(m_GrigliaWeb.Columns.FindByDataField("CostoMacchina"), GridBoundColumn).FooterStyle.HorizontalAlign = HorizontalAlign.Right
	CType(m_GrigliaWeb.Columns.FindByDataField("CostoMacchina"), GridBoundColumn).FooterStyle.ForeColor = Drawing.Color.Red
ITEM <label class="argomento VB"></label> 	
Formattare una data
CDate(oLavaggio.TIME_OUT).ToString("dd/MM/yyyy HH:mm:ss.fff")
ITEM <label class="argomento JS"></label> 
In javascript per gestire campi numerici formattandoli come 3,14 anzichè 3.14:
function FormattaNumeriInput(){
    $('.inputTest').each(function () {
        if (($(this).val() != '') && isNumero($(this).val())) {
            $(this).val($(this).val().replace(".", ","))
        }
    });
}

function isNumero(n) {
    n = n.replace(",",".")
    return jQuery.isNumeric(n);
}
ITEM <label class="argomento VB"></label>
Formattare il tetso in .NET
 "{0:N2}" ha 2 decimali
ITEM <label class="argomento JS"></label> 
Hover gestito in javascript: due callback, una per quando arrivo sull'oggetto, una per quando ne esco
 $('#ctl00_content_txtRicaviTest1').hover(function () {
	$('#ctl00_content_txtRicaviTest1').css("font-size", "17px !important");
	$('#ctl00_content_lblRicaviVendite').css("font-size", "17px !important");
	$('#ctl00_content_txtRicaviTest1').css("background-color", "#cceb8ea8");
	$('#ctl00_content_lblRicaviVendite').css("background-color", "#cceb8ea8");
},
function () {
	$('#ctl00_content_txtRicaviTest1').css("font-size", "15px !important");
	$('#ctl00_content_lblRicaviVendite').css("font-size", "15px !important");
	$('#ctl00_content_txtRicaviTest1').css("background-color", "");
	$('#ctl00_content_lblRicaviVendite').css("background-color", "");
});
ITEM <label class="argomento VB"></label> In un form a tasche si apre sempre una tasca specifica ---> è presente la classe active
&lt;li class="active"&gt;&lt;a href="#tabDiBa" data-toggle="tab"&gt;Di. Ba.&lt;/a&gt;&lt;/li&gt;
ITEM <label class="argomento SQL"></label>UNION vs UNION ALL 
The only difference between Union and Union All is that Union extracts the rows that are being specified in the query while Union All extracts all the rows including the duplicates (repeated values) from both the queries.

I nomi delle colonne basta specificarli nella prima Select, a prescindere dalla presenza dell'ALL...
ITEM <label class="argomento VB"></label> 
Aggiungere colonne al datatable:

        Dim View As New DataView
        'Oss: non metto condizioni sulla presenza di righe perchè mi serve esista la nuova colonna per la cWinDef
        If Not dt Is Nothing Then
            View = dt.DefaultView
            dt = View.ToTable()

            '--- Aggiungo la colonna Tempo
            Dim c As New DataColumn
            c = New DataColumn()
            c.DataType = System.Type.GetType("System.String")
            c.ColumnName = "Tempo"
            c.AutoIncrement = False
            c.Caption = "Cassoni"
            c.ReadOnly = False
            c.Unique = False
            dt.Columns.Add(c)

            '--- Aggiungo la colonna Totale            
            c = New DataColumn()
            c.DataType = System.Type.GetType("System.String")
            c.ColumnName = "Totale"
            c.AutoIncrement = False
            c.Caption = "Cassoni"
            c.ReadOnly = False
            c.Unique = False
            dt.Columns.Add(c)
        End If
ITEM <label class="argomento VB"></label>Aggiungere riga al datatable
Dim riga As DataRow = dt.NewRow
            riga("Valore") = op.Leggi("Valore_" & i)
            riga("Descrizione") = op.Leggi("Testo_" & i)
            dt.Rows.Add(riga)		
ITEM <label class="argomento JS"></label>	
Metodi per fare i conti con JavaScript (cfr. Invat ConsultazioneLottiEconomica):

1) Sommare i valori in base degli input con classe specifica:

    let ricavi = 0;
    $('.costiTest').each(function () {
        if (($(this).val() != '')) {
            costi = parseFloat(costi) + parseFloat($(this).val().replace(".", "").replace(",", "."));
        }
    });
	
2) Funzione IsNumero

function isNumero(n) {
    n = n.replace(",", ".")
    return jQuery.isNumeric(n);
}	

3) Formattazione numeri negli input

function FormattaNumeriInput(numeroDecimali = '') {
    if (numeroDecimali == '') numeroDecimali = 2;
    $('.inputTest').each(function () {
        if (($(this).val() != '') && isNumero($(this).val())) {           
            let valoreFormattato = parseFloat($(this).val().replace(",", ".")).toFixed(numeroDecimali).replace(".", ",")            
            $(this).val(valoreFormattato)        
        }
        else if( $(this).val() == 'NaN' ||  $(this).val() == 'Infinity'){
            $(this).val('')
        }
    });
}	
ITEM <label class="argomento VB"></label> 
Come si crea un Enumeratore
    Public Enum enuTipiStatiSegnalazione
        Nuova = 0
        Aperta = 1
        Chiusa = 2
        Archiviata = 99
    End Enum	
ITEM <label class="argomento JS"></label> 	
Gestione dell'altezza della textarea:
$('#ctl00_corpo_txtNote').css('height', $('#ctl00_corpo_txtNote').prop('scrollHeight'));
ITEM <label class="argomento VB"></label> 
Aggiungere le Stampe:

1) ceo nuovo progetto --&gt; Libreria di classi --&gt; ProgettoRPT
2) Nei riferimenti aggiungo CBo, CBOStampe, CBOUtil, ProgettoDLL (se presente)
3) Nel ProgettoRPT aggiungo i riferimenti System corretti + TelerikReporting.dll ---&gt; stessa versione del Telerik nella CBOStampe
   Nel Progetto aggiungo il riferimento al ProgettoRPT
   Nel ProgettoDLL aggiungo il riferimento al ProgettoRPT
4) Nel ProgettoDLL Aggiungo la cStampa
5) Tasto dx sul ProgettoRPT Aggiungi Nuovo Elemento Telerik Report (Blank)
6) Aggiungo nel file appena creato la sqlDataSource: qui compilo la query e svuoto la connection string (non serve)
7) Nella classe base per cui creo il report devo definire il metodo 
		
		Public Function GeneraReport
8) Nel codice del report aggiungere dopo l'InizializeComponent
    
	Private Sub rSegnalazione_Default_ItemDataBinding(sender As Object, e As EventArgs) Handles Me.ItemDataBinding
        Dim sSql As String = Me.SqlDataSource1.SelectCommand

        sSql = sSql.Replace("$DbMaster$", IStampe_StringoneParam.Leggi("IdSegnalazione"))

        Dim dtSource As DataTable = cDBUtility.GetDataTable(sSql, Me.CboConnection)
        TryCast(sender, Telerik.Reporting.Processing.Report).DataSource = dtSource
    End Sub		
9) per la visualizzazione deve essere installato pdfjs
10) Verificare che anche nella cboWebResource ci siano le stesse DLL Telerik!
11) <b>Attenzione</b>: se non funziona niente verificare che i riferimenti puliti nel WebConfig!!!
ITEM <label class="argomento SQL"></label> 
In SQL appiccicare data e ora 
CONVERT(varchar(10), DATEADD(day,1, pre_RepTur.Giorno), 111) + ' ' + CONVERT(varchar(12), pre_TabTurni.Ora_End, 114)
ITEM <label class="argomento JS"></label> Aggiungere tooltip
i) per aggiungere il tooltip base usare l'attributo title
ii) per personalizzarlo usare popper.min.js:
	a) aggiungo il file al progetto
	b) aggiungo il riferimento alla pagina
	c) nella pagina inizializzo i tooltip con 
		$(function () {
		  $('[data-toggle="tooltip"]').tooltip()
		})
	d) aggiungo il tooltip inserendo gli attributi
		data-toggle="tooltip" data-placement="top" data-html="true" title="Tooltip on top"
		
		(avendo data-html="true" posso usare i tag html, ad es &lt;br&gt; per andare a capo)
	e) per personalizzare l'html: 
		.tooltip{
           font-size: 16px;
        }
ITEM <label class="argomento VB"></label>  In Gestione Tabelle non compilare il Disabilita Tasti perchè da errore (non gestito nel codice...)
ITEM <label class="argomento VB"></label>
Cambiare in real time datatable della griglia:
For i As Integer = 1 To m_DescrizioniDocumenti.Count
            'ciclo ogni entrata del cproprieta che è del tipo  <RIGA_1>desc1</RIGA_1><RIGA_2>descrizione2</RIGA_2>

            Dim rowIndex = m_DescrizioniDocumenti.nomeProprieta(i).Replace("RIGA_", "")
            Dim nuovadescr As String = m_DescrizioniDocumenti.Leggi(m_DescrizioniDocumenti.nomeProprieta(i))
            m_dtDocumenti(rowIndex - 1)("Descrizione") = nuovadescr
        Next
        m_oGridDocumenti.Griglia.DataBind()
ITEM <label class="argomento VB"></label> Un webservice funziona in debug ma da errore 500 compilato: nel webconfig potrei avere la configurazone 'Autenticazione windows' anzichè con password		
ITEM <label class="argomento VB"></label>Metodi utili per ottenere il nome del file:
System.IO.Path.GetFileName()
System.IO.Path.GetFileNameWithoutExtension()
ITEM <label class="argomento VB"></label> Per prendere il testo di una DropDownList:
$('#ctl00_body_txt option :selected').text()
ATTENZIONE ALLO SPAZIO PRIMA DEI DUE PUNTI!
ITEM <label class="argomento VB"></label> 
When an UpdatePanel control is not inside another UpdatePanel control, the panel is updated as determined by the settings of the UpdateMode and ChildrenAsTriggers properties, together with the collection of triggers. When an UpdatePanel control is inside another UpdatePanel control, the child panel is automatically updated when the parent panel is updated.

The content of an UpdatePanel control is updated in the following circumstances:

If the UpdateMode property is set to Always, the UpdatePanel control's content is updated on every postback that originates from anywhere on the page. This includes asynchronous postbacks from controls inside other UpdatePanel controls and postbacks from controls that are not inside UpdatePanel controls.

If the UpdatePanel control is nested inside another UpdatePanel control and the parent update panel is updated.

If the UpdateMode property is set to Conditional, and one of the following conditions occurs:

You call the Update method of the UpdatePanel control explicitly.

The postback is caused by a control defined as a trigger by using the Triggers property of the UpdatePanel control. In this scenario, the control explicitly triggers an update of the panel content. The control can be either inside or outside the UpdatePanel control that defines the trigger.

The ChildrenAsTriggers property is set to true and a child control of the UpdatePanel control causes a postback. A child control of a nested UpdatePanel control does not cause an update to the outer UpdatePanel control unless it is explicitly defined as a trigger.
ITEM <label class="argomento VB"></label> 
Telerik file uploader:
1)ASPX
&lt;div  id="divFile" class="col-xs-12 col-md-2" style="padding:0;"&gt;
                            &lt;b&gt;File&lt;/b&gt;&lt;br /&gt;
                            &lt;telerik:RadAsyncUpload id="upDocumento" runat="server" MaxFileInputsCount="1" &gt;                               
                            &lt;/telerik:RadAsyncUpload&gt;
                            &lt;cbo:CheckBox ID="chkFile" runat="server" TypeControl="CheckBox" TypeData="Numeric" CssClass="checkbox"/&gt;
                        &lt;/div&gt;
						
2) VB.NET
metodi/ proprietà utili
If upDocumento.UploadedFiles.Count > 0 Then
	op.Scrivi("NomeFile", upDocumento.UploadedFiles(0).FileName)
Else
	op.Scrivi("NomeFile", "")
End If

If Not Directory.Exists(sPathTmp) Then Directory.CreateDirectory(sPathTmp)
sPathTmp += "\" & upDocumento.UploadedFiles(0).FileName
upDocumento.UploadedFiles(0).SaveAs(sPathTmp, True)

upDocumento.UploadedFiles.Clear()	
ITEM <label class="argomento VB"></label> FormattaTempoSecondi
	''' &lt;summary&gt;
    ''' Metodo che preso in input il numero di secondi restituisce una stringa formattata come XXh XXmin. Se le ore sono 0 scrive solo i minuti
    ''' &lt;/summary&gt;
    ''' &lt;param name="sSecondi"&gt;&lt;/param&gt;
    ''' &lt;param name="bVisualizzaSecondi"&gt;Opzionale, se impostato formatta il tempo come XXh XXmin XXsec&lt;/param&gt;
    ''' &lt;returns&gt;&lt;/returns&gt;
    ''' &lt;remarks&gt;&lt;/remarks&gt;
    Public Shared Function FormattaTempoSecondi(ByVal sSecondi As String, Optional ByVal bVisualizzaSecondi As Boolean = False) As String
        If sSecondi IsNot Nothing Then
            'nel caso un decimale sia formattato come 3.14 lo trasformo in 3,14
            sSecondi = sSecondi.Replace(".", ",")

            If CInt(sSecondi) &lt; 0 Then
                Return "0"
            Else
                Dim iOreStima As Integer = Math.Floor(CInt(sSecondi) / 3600)
                Dim iMinStima As Integer = Math.Floor((CInt(sSecondi) - 3600 * iOreStima) / 60)
                Dim iSecondi As Integer = sSecondi - 3600 * iOreStima - 60 * iMinStima

                'Paolo 28/4
                'arrotondamento
                If iSecondi &gt; 30 AndAlso bVisualizzaSecondi = False Then
                    'ricalcolo: modifico il tempo 
                    'se 43 secondi aggiungo al totale 17sec e ricalcolo ore e minuti (i secondi no perchè non li vado a presentare, bVisualizzaSecondi = False)
                    sSecondi += (60 - iSecondi)
                    iOreStima = Math.Floor(CInt(sSecondi) / 3600)
                    iMinStima = Math.Floor((CInt(sSecondi) - 3600 * iOreStima) / 60)
                End If

                If iOreStima &gt; 0 Then
                    FormattaTempoSecondi = iOreStima.ToString & "h " & iMinStima.ToString & " min"
                Else
                    FormattaTempoSecondi = iMinStima.ToString & " min"
                End If

                If bVisualizzaSecondi Then
                    FormattaTempoSecondi = FormattaTempoSecondi & " " & iSecondi.ToString & "sec"
                End If
            End If
        Else
            Return "0"

        End If
    End Function	

altra versione
Public Shared Function FormattaTempoSecondi(ByVal sSecondi As String, Optional ByVal bVisualizzaSecondi As Boolean = False, Optional ByVal ArrotondaNMinuti As Integer = 0) As String
        If sSecondi IsNot Nothing Then
            'nel caso un decimale sia formattato come 3.14 lo trasformo in 3,14
            sSecondi = sSecondi.Replace(".", ",")

            If CInt(sSecondi) < 0 Then
                Return "0"
            Else
                Dim iOreStima As Integer = Math.Floor(CInt(sSecondi) / 3600)
                Dim iMinStima As Integer = Math.Floor((CInt(sSecondi) - 3600 * iOreStima) / 60)
                Dim iSecondi As Integer = sSecondi - 3600 * iOreStima - 60 * iMinStima
                If ArrotondaNMinuti > 0 Then
                    Dim secondiArrotondamento As Integer = 60 * ArrotondaNMinuti
                    'arrotondamento
                    If bVisualizzaSecondi = False Then

                        Dim iSecArrotondati As Integer = iSecondi Mod secondiArrotondamento
                        If iSecArrotondati > (secondiArrotondamento / 2) Then
                            iSecondi += (secondiArrotondamento - iSecArrotondati)
                        End If

                        iOreStima = Math.Floor(CInt(sSecondi) / 3600)
                        iMinStima = Math.Floor((CInt(sSecondi) - 3600 * iOreStima) / 60)
                    End If
                End If

                If iOreStima > 0 Then
                    FormattaTempoSecondi = iOreStima.ToString & "h " & iMinStima.ToString & " min"
                Else
                    FormattaTempoSecondi = iMinStima.ToString & " min"
                End If

                If bVisualizzaSecondi Then
                    FormattaTempoSecondi = FormattaTempoSecondi & " " & iSecondi.ToString & "sec"
                End If
                End If
        Else
                Return "0"

        End If
    End Function	
	
ITEM <label class="argomento VB"></label> 	
Scaricare file da update panel
1)
	&lt;asp:updatepanel ID="upDoc" runat="server" updateMode="Conditional" ChildrenAsTriggers="True"&gt;
		&lt;ContentTemplate&gt;
			&lt;cbo:GridView ID="grdDocumenti" runat="server"&gt;&lt;/cbo:GridView&gt;
				&lt;button id="btnAggDescGriglia" runat="server" class="hidden"&gt;Agg Desc Griglia&lt;/button&gt; 
		 
			&lt;cbo:TextBox ID="txtNomeFileDownl" runat="server" CssClass ="form-control" style="display:none"&gt;&lt;/cbo:TextBox&gt;
			&lt;asp:LinkButton ID="LinkButtonDownload" OnClientClick="Download_Click" runat="server" style="display:none"&gt;LinkButtonDownload&lt;/asp:LinkButton&gt;
		&lt;/ContentTemplate&gt;
		&lt;Triggers&gt;
			&lt;asp:PostBackTrigger ControlID="LinkButtonDownload" /&gt;
		&lt;/Triggers&gt;
	&lt;/asp:updatepanel&gt;
						
2) 
Private Sub m_oGridDocumenti_FCODE(ByRef KeyPress As Integer) Handles m_oGridDocumenti.FCODE

	Select Case KeyPress            
		Case System.Windows.Forms.Keys.F9
			'-- Scarico il file
			Dim sNomeFile As String = m_oGridDocumenti.GetRigaSelezionata.Leggi("FileDoc")

			txtNomeFileDownl.Text = sNomeFile
			Dim sScript As String = "javascript:__doPostBack('ctl00$corpo$LinkButtonDownload',''); "

			Telerik.Web.UI.RadScriptManager.RegisterStartupScript(upDoc, upDoc.GetType, "1", sScript, True)
			
3) Private Sub LinkButtonDownload_Click(sender As Object, e As EventArgs) Handles LinkButtonDownload.Click
        Dim sNomeFile As String = txtNomeFileDownl.Text

        Response.Clear()
        Response.ContentType = "application/octet-stream"
        Response.AppendHeader("Content-Disposition", "attachment; filename=" + sNomeFile)
        Response.TransmitFile(Request.PhysicalApplicationPath & "Tmp\" & Utente.UserID & "\" & sNomeFile)
        Response.End()
    End Sub		
ITEM <label class="argomento VB"></label> Cercare in VB un elemento/oggetto della pagina:
	
	Dim cmb As CBO.Web.UI.WebControls.DropDownList

	cmb = ControlFinder.PageFindControl(Me, "cmbID")
	cmb = DirectCast("cmbID", CBO.Web.UI.WebControls.DropDownList)
/*
ITEM <label class="argomento VB"></label> 	
	Private Function GetSourceFromcProprieta(ByVal op As cProprieta) As DataTable
        'il cProprieta ha la forma
        '&lt;Valore_1&gt;AG&lt;/Valore_1&gt;&lt;Testo_1&gt;Anello di guasto&lt;/Testo_1&gt;&lt;Valore_2&gt;VA&lt;/Valore_2&gt;&lt;Testo_2&gt;Volt-amperometrico&lt;/Testo_2&gt;
        Dim dt As New DataTable
        'Dim View As New DataView
        'View = dt.DefaultView
        'dt = View.ToTable()

        '--- Aggiungo le colonne Valore e Descrizione
        Dim c As New DataColumn
        c = New DataColumn()
        c.DataType = System.Type.GetType("System.String")
        c.ColumnName = "Valore"
        c.AutoIncrement = False
        c.Caption = "Valore"
        c.ReadOnly = False
        c.Unique = False
        dt.Columns.Add(c)

        c = New DataColumn()
        c.DataType = System.Type.GetType("System.String")
        c.ColumnName = "Descrizione"
        c.AutoIncrement = False
        c.Caption = "Descrizione"
        c.ReadOnly = False
        c.Unique = False
        dt.Columns.Add(c)

        'aggiungo le righe al datatable
        Dim i As Integer = 0
        Dim MaxCounter As Integer = (op.Count / 2)
      
        While i &lt; MaxCounter
            Dim riga As DataRow = dt.NewRow
            riga("Valore") = op.Leggi("Valore_" & i)
            riga("Descrizione") = op.Leggi("Testo_" & i)
            dt.Rows.Add(riga)
            i += 1
        End While

        Return dt
    End Function
	
ITEM <label class="argomento VB"></label>Instr
Restituisce un Integer che specifica la posizione di inizio della prima occorrenza di una stringa in un'altra. 
Il numero intero è un indice a base uno se viene individuata una corrispondenza. 
Se non viene rilevata alcuna corrispondenza, la funzione restituisce 0.

Grafici: per formattare correttamente i valori numerici nei tooltip/nei nodi del grafico devo (cfr. Grafici.aspx di HR)
1) importare kendo ed istanziarlo
2) usare {0:N2}
ITEM <label class="argomento VB"></label> Nei reporto per concatenare campi in cui uso il Fields in un unico textbox posso formattere il testo come 

rapporto di verifica n. {Fields.[NumVerbale]}  in cui vengono descritti 

ponendo tra {} il Fields. 
ITEM <label class="argomento VB"></label>
Nella Browse per impostare il numero di righe devo fare nella cwinDef
m_GrigliaWeb.AllowPaging = True
m_GrigliaWeb.PageSize = 20
ITEM <label class="argomento VB"></label> 
Cambiare sfondo pagina di login da backend
1) Nel parametro $LG mettere ilp ath nel &gt;IMG4&lt;
2) nel codice vb aggiungoDim PathSfondo As String = cFunzioni.Nz(opLogo.Leggi("IMG4"), "")
            If PathSfondo &lt; &gt; "" Then
                If System.IO.File.Exists(PathSfondo) Then
                    Dim nomeSfondo As String = System.IO.Path.GetFileName(PathSfondo)
                    Dim currentPath As String = HttpContext.Current.Request.PhysicalApplicationPath & "Images\" & nomeSfondo
                    If Not System.IO.File.Exists(currentPath) Then
                        System.IO.File.Copy(PathSfondo, currentPath)                        
                    End If                    
                    PaginaBody.Attributes.CssStyle("background-image") = "url(Images/" & nomeSfondo & ")"
                    PaginaBody.Attributes.CssStyle("background-size") = "cover"
                End If
            End If
ITEM <label class="argomento VB"></label> 
Nella browse non funzionano corerttamente campi fata/filtri relativi:
nel tag sostituice tutto giusto, ma in pratica qualcosa non va ---> Ho scordato i datafield scritti!!!!
ITEM <label class="argomento JS"></label> 
In Javascript per gestire dei checkbox stile radiobutton devo fare
Nell'aspx:	
		onchange="VisualizzaCampi_VerProt(this)"
Nel js;
		function VisualizzaCampi_VerProt(element) {
			switch(element.id){
				case 'chkFlagTastoC':
					$('#chkFlagTastoNC').prop('checked', '')
					break;
				case 'chkFlagTastoNC':
					$('#chkFlagTastoC').prop('checked', '')
					break;
				case 'chkFlagEsitoC':
					$('#chkFlagEsitoNC').prop('checked', '')
					break;
				case 'chkFlagEsitoNC':
					$('#chkFlagEsitoC').prop('checked', '')
					break;
			}
		}
ITEM <label class="argomento JS"></label> 
Per eseguire un javascript in seguito ad un postback parziale posso fare
$(document).ready(function () {
    // Register event handler
    pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
    Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(pageLoaded);
,,
}

/// Executed when all page content is refreshed, full page or async postback
function pageLoaded(sender, args) {
    ...
}	
ITEM <label class="argomento JS"></label> 
Per visualizzare uno showloading su una porzione di pagina specifica di cui conosco l'id
$find('ctl00_raLoadingPanel').show('id')
$find('ctl00_raLoadingPanel').hide('id')
ITEM <label class="argomento VB"></label> 
Per nascondere una tasca della screen posso fare
		ScriptPagina += "$('#btnNOMETASCA').parent().css('display', 'none'); "
ITEM <label class="argomento VB"></label> Per aggiungere in una cBrowseToScreen il conferma sull'elimina, nella cWinDef:
		
'aggiungo un confirm sull'elimina se c'è
If item.Cells(item.Cells.Count - 1).Controls(0).GetType.ToString = "CBO.Web.UI.WebControls.ImageButton" Then
	Dim btnElimina As CBO.Web.UI.WebControls.ImageButton = item.Cells(item.Cells.Count - 1).Controls(0)
	item.Cells(item.Cells.Count - 1).Controls.Clear()
	btnElimina.OnClientClick = "if (!confirm('Eliminare la protezione selezionata?')){return false;}"
	item.Cells(item.Cells.Count - 1).Controls.Add(btnElimina)	
End If
ITEM <label class="argomento VB"></label>
Per aggiungere in una esportazione Excel con Telerik delle pagine
		'creo il file excel
    Dim workbook As New Telerik.Windows.Documents.Spreadsheet.Model.Workbook
		'aggiungo le pagine e le rinomino
	Dim worksheet As Telerik.Windows.Documents.Spreadsheet.Model.Worksheet = workbook.Worksheets.Add()
	worksheet.Name = "NomePagina"
ITEM <label class="argomento VB"></label> 	
	'aggiungo il filtraggio delle colonne
	(Imports Telerik.Windows.Documents.Spreadsheet.Model
	 Imports Telerik.Windows.Documents.Spreadsheet.Model.Filtering)
	Dim filterRange As CellRange = New CellRange(0, 1, 5, 2)
	worksheet.Filter.FilterRange = filterRange
	Dim filter As DynamicFilter = New DynamicFilter(1, DynamicFilterType.AboveAverage)
	worksheet.Filter.SetFilter(filter)
ITEM <label class="argomento VB"></label> 	
Nel web.Config per permettere l'apertura non autenticata di un form NOME.aspx, sotto al tag
 <location path="Scripts">

aggiungere il blocco seguente 

&lt;location path="NOME.aspx"&gt;
    &lt;system.web&gt;
      &lt;authorization&gt;
        &lt;allow users="?"/&gt;
      &lt;/authorization&gt;
    &lt;/system.web&gt;
  &lt;/location&gt;
	
ITEM <label class="argomento VB"></label> 
UTILISSIMO NEI REPORT: posso concatenare testo letto dai Fields come segue
{Fields.[NumVerbale]}
ITEM <label class="argomento VB"></label> 
Lato html per avere la possibilità di scattare foto o caricare da libreria un'immagine :
<input id="txtFotoFile" type="file" accept="image/*" style="display: none; text-align: center;" onchange="CaricaFoto" />
ITEM <label class="argomento VB"></label> 
Creo il srReport
Agg il srReport nel report 
Imposto i Report Parameters
Aggiungo i Report Parameters nel srReport
Un subReport finisce a caso in una pagina da solo: è troppo grande, ridimensionarlo!

ITEM <label class="argomento VB"></label> Per unire due datatable posso fare
dtRet.Merge(dt)
ITEM <label class="argomento JS"></label> 	
Nei telerik:RadAsyncUpload usare, per sapere se ci sono documenti allegati,

	$find('upDocumento').getUploadedFiles().length == 0

Per svuotare l'uploader invece	posso fare (non ho trovato il metodo js ad hoc)
	
	$('.ruButton, .ruRemove').click();
ITEM <label class="argomento VB"></label>
Per nascondere dei campi nel report e modificare l'altezza dei pannelli posso fare tipo;
	Dim txt, txtDataChiusura As Telerik.Reporting.Processing.TextBox

	Dim pApertura As Telerik.Reporting.Processing.Panel = DirectCast(Telerik.Reporting.Processing.ElementTreeHelper.GetChildByName(sender, "pApertura"), Telerik.Reporting.Processing.Panel)
		
	h_Chiusura = New Telerik.Reporting.Drawing.Unit("0 px")
	If Not CBool(IStampe_StringoneParam.Leggi("VisSoluzione")) Then
		txt = DirectCast(Telerik.Reporting.Processing.ElementTreeHelper.GetChildByName(pChiusura, "lblSoluzione"), Telerik.Reporting.Processing.TextBox)
		h_Chiusura += txt.Height
		txt.Visible = False
		txt = DirectCast(Telerik.Reporting.Processing.ElementTreeHelper.GetChildByName(pChiusura, "txtSoluzione"), Telerik.Reporting.Processing.TextBox)
		h_Chiusura += txt.Height
		txt.Visible = False
	End If
	pChiusura.Height = pChiusura.Height - h_Chiusura
ITEM <label class="argomento JS"></label>Per effettuare lo scroll della pagina ad un punto indicato
		$("html, body").animate({ scrollTop: $('.lblFotoCaricate').offset().top }, 'fast');	
ITEM <label class="argomento JS"></label> 	
Per gestire lato client il ridimensionamento ed il successivo upload delle immagini (tramite WebService) posso fare:
function UploadFoto() {       
        let canvas;
        var foto = $("#txtFotoFile").prop('files')[0];
        //se la foto non esiste carico con WS sul server
        //altrimenti segnalo che la foto esiste
        
        if (VerificaFotoEsiste(foto.name)) {
            //alert(callWebService('ComuneWs.svc', 'GetMessaggio', '{ "CodApp" : "' + codApp + '", "CodMessaggio" : "FotoEsiste" }'));
            alert('Foto già caricata')
            return false;
        }
        ShowLoading();

    //imposto il timeout per visualizzare lo showloading che altrimenti non si vedrebbe
        setTimeout(function () {
            
            var reader = new FileReader();
            reader.readAsDataURL(foto);
            reader.onloadend = function () {
                const blobURL = URL.createObjectURL(foto);
                const img = new Image();
                img.src = blobURL;                
                URL.revokeObjectURL(foto);

                img.onload = function () {
					//Ridimensiono
                    var canvas = document.createElement("canvas");
                    var context = canvas.getContext("2d");
                    const width = GetWidthResize(img.width); 
                    const scaleFactor = width / img.width;
                    canvas.width = width;
                    canvas.height = img.height * scaleFactor;
                    context.drawImage(img, 0, 0, width, img.height * scaleFactor);                    
                    let FotoDaCaricare = canvas.toDataURL('image/jpeg');              
                    var op = new cProprieta();

                    var op = new cProprieta();
                    op.Scrivi('', callWebService('Segnalazione.svc', 'CaricaFoto', '{ "token" : "' + localStorage['CLK_Token'] + '", "nomeFoto" : "' + foto.name + '", "byteFoto" : "' + FotoDaCaricare + '" }'));

                    if (op.Leggi('Errore') != '') {
                        alert(op.Leggi('Errore'));
                    }
                    else {
                        
                    }

                    $("html, body").animate({ scrollTop: $('.lblFotoCaricate').offset().top }, 'fast');
                    HideLoading();
                }
            }

        }, 100);    
}

//Scelgo di impostare a 200 il valore di larghezza massimo
const MAX_WIDTH = 2000;
function GetWidthResize(originalWidth){
    if (originalWidth === undefined) return MAX_WIDTH;

    if (originalWidth < MAX_WIDTH) return originalWidth
    else return MAX_WIDTH
}
ITEM <label class="argomento VB"></label> Per fare dubug usb da smartphone andare alla pagina 
			chrome://inspect#devices
ITEM <label class="argomento VB"></label> Nella gestione tabelle salva correttamente, ma non riport aall'elenco dopo il Conferma:
potrei aver usato degli alias nella query scritta nel campo Stringa SQL: gli alias se visibili (= senza l'asterisco) NON devono avere le quadre,
quelli nascosti (= CON asterisco) invece devono avere le quadre
ITEM <label class="argomento VB"></label> Per installare il certificato su IIS (si installa globalmente, non a livello del nodo!):
1) lo copio sul server
2) creo una cartella e ci copio dentro il file (pfx)
3) mi copio la password necessaria 
4) IIS -> nome del server -> Server Certificates (icona nel pezzo IIS) -> doppio click -> Import 
-> "Select certificate Store" = Personal e tango la spunta "Allow this certificate to be exported" checkata

ITEM <label class="argomento VB"></label> Appunti vari
\\serverad\Archivi\LEO\INTERNI\Master\Documenti Master\_Documentazione Moduli Master\Installazione Master - SQL - IIS
ITEM <label class="argomento VB"></label> Forzare un Refresh (control + F5) da javascript  location.reload()
ITEM <label class="argomento VB"></label> CSAL11 Salvarezza Piero Luigi (= dottor salvarezza su MasterHR)
ITEM <label class="argomento"></label> 
Per installare il certificato
1) lo copio sul server
2) creo una cartellae ci copio dentro il file (pfx)
3) mi copio la password neecssaria 
4) IIS -> nome del server -> Server Certificates (icona nel pezzo IIS) -> doppio click -> Import 
-> tengo "Select certificate Store" = Personal e tengo la spunta "Allow this certificate to be exported"
===================================================================
nuovo nodo:
1) nuovo pool:
	- Enable 32 bit: TRUE
	- .NET CLR versione: v4.0
	- Pipeline Mode: INTEGRATED
	- Identity: webuser.leonardo + cercare la pwd!!!
	- Idle Time-out (minutes): 0
Sites -> add Websites 

==============================
\\serverad\Archivi\LEO\INTERNI\Master\Documenti Master\_Documentazione Moduli Master
==============================
ITEM <label class="argomento JS"></label>     
function GetPosizione() {
        debugger;
        let p = navigator.geolocation.getCurrentPosition(success, error, options);
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };


    function success(pos) {
        debugger;
        const crd = pos.coords;

        console.log('Your current position is:');
        console.log('Latitude : ' + crd.latitude );
        console.log('Longitude: ' +crd.longitude');
        console.log('More or less ' + crd.accuracy + ' meters.);
    }
        function error(err) {
            debugger;
        console.warn( err.code+ ' ' + err.message);
    }

ITEM <label class="argomento VB"></label> La ZDBL per Stefano va fatta sia che aggiunga un campo sia una tabella (script allegato) sia un parametro
ITEM <label class="argomento VB"></label> Se nelle traduzioni non traduce un elemento figlio ---> al padre macano id e runat='server'
ITEM <label class="argomento VB"></label>  Refresh del solo update panel                      
__doPostBack('upSchedeProdott', '');
ITEM <label class="argomento VB"></label> Se in gestione tabelle devo verificare l'eliminazione con una tabella di Master, se <b>vistata</b> posso a mano scrivere i valori nella ElencoTabelle_C,
ITEM <label class="argomento VB"></label> Nei report Telerik per avere una nuova pagina occorre andare sul detail -> proprietà -> PageBreak BeforeAndAfter
ITEM <label class="argomento VB"></label> Certifor: come creare intervento + evaderlo con report
1) (Admin)Impianto nuova visita
2) (Operatore) Pianif visite accetta + prgramma visita
3) in griglia click sull'icona del rpt -> conferma in bozza -> rientro conferma & crea pdf
ITEM <label class="argomento VB"></label> Se dopo aver aggiornato APP e Gestione non funziona corretamente il tutto, può essere che vada aggiornato il numero di versione nel WebService!
ITEM <label class="argomento VB"></label> Spostare una pagina all'id indicato 
function SpostaPagina() {
            $('.emptyDiv').css('height', '1000px');
            window.scrollTo({ top: $('#ID').offset().top - parseFloat($('.navbar-header').css('height')), behavior: 'smooth' });

        }
ITEM <label class="argomento VB"></label> I PageValue non vengono passati: scrivo AddFuturePageValue("CalendarioTecnici.aspx", pv), invece va scritto il percorso 
assoluto con la tilde AddFuturePageValue("~/CalendarioTecnici.aspx", pv)
ITEM <label class="argomento VB"></label> Disabilitare tasca nella screen 
strScript += "$('#btnTabDatiContr').removeAttr('href').css('background', '#eee').css('color', '#000').css('cursor', 'not-allowed');"
ITEM <label class="argomento VB"></label> Uso dei TimeSpan nella gestione del radCalendar
        Dim op As New cProprieta        
        If cFunzioni.Nz(MasterLiftDLL.cParametri.rilparN("$VC", Connessione), "0") = "1" Then
            op.Scrivi("", cFunzioni.Nz(MasterLiftDLL.cParametri.rilparT("$VC", Connessione), ""))
            Dim dStartTime As DateTime = CDate(cFunzioni.Nz(op.Leggi("DayStartTime"), "00.00.00"))
            Dim dEndTime As DateTime = CDate(cFunzioni.Nz(op.Leggi("EndStartTime"), "23.59.59"))
            Dim intervalS As New TimeSpan(dStartTime.ToString("HH"), dStartTime.ToString("mm"), dStartTime.ToString("ss"))
            Dim intervalE As New TimeSpan(dEndTime.ToString("HH"), dEndTime.ToString("mm"), dEndTime.ToString("ss"))
            rsCalendario.DayStartTime = intervalS
            rsCalendario.DayEndTime = intervalE
        Else           
            rsCalendario.DayStartTime = New TimeSpan(0, 0, 0)
            rsCalendario.DayEndTime = New TimeSpan(23, 59, 59)
        End If
ITEM <label class="argomento"></label> preventivo = doc interno,
offerta = doc che do al cliente
ITEM <label class="argomento VB"></label> Nell'F2 non passa il testo dal txt al form dialog ---> verificare che dopo il click non sia svuotato il txt 
(magari lo gestisco nel pre render e lì viene svuotato...)
ITEM <label class="argomento VB"></label> 
una rbowin (personalizzata) non funziona: ho messo giusto il "campo " ed il valore di ritorno? 
ITEM <label class="argomento "></label> Un'applicazione su IIS da un errore: il Pool è stato configurato correttamente?
ITEM <label class="argomento VB"></label> Auto Complete
	&lt;cbo:RadAutoCompleteBox ID="txtPark_TargaSemirimorchio" runat="server" TypeControl="TextBox" TypeData="Text" DataField="Park_TargaSemirimorchio" Width="100%"                                 
		InputType="Text" TextSettings-SelectionMode="Single" HighlightFirstMatch="true" MinFilterLength="3"
		DataValueField="TargaCnt" DataTextField="TargaCnt" OnF2="txtCtrl"&gt;&lt;/cbo:RadAutoCompleteBox&gt;
	
	Aggiungere una rbowin con controllo txtCtrl (specificato nell'ONF2) per tirare su la source (così posso avere più controlli ed 1 sola rbowin)
	IMPORTANTE: valorizzare il valore Ritorno dell'rbowin con il campo descrittivo!
	<a href='https://docs.telerik.com/kendo-ui/api/javascript/ui/autocomplete' target="_blank">docs.telerik</a>
	<i>MinFilterLength</i> = The minimum number of characters the user must type before a search is performed. Set to higher value than 1 if the search could match a lot of items.
	
	Lato JS 
		(uso l'id "completo"!)
		
		-per ottenere il valore del textbox devo fare:
		$find('ctl00_content_txtCodTipoContainer1').get_entries().getEntry(0).get_value();
		
		-per ripulire il textbox:
		$find('ctl00_content_txtCodTipoContainer1').get_entries().clear();;
	
	Lato VB 
		- per ottenere il valore del textbox devo fare:
		txtCodTipoContainer1.Entries(0).Value
		
		- per vedere se il textbox è compilato devo fare il controllo:
		txtCodTipoContainer1.Entries.Count > 0
ITEM <label class="argomento VB"></label> 	
function setAutoCompleteFocus(id) {
    var autoComplete = $find(id);
    autoComplete._inputElement.focus();
}	
ITEM <label class="argomento VB"></label> 	
	Non funziona l'update di un campo datetime, ci scrive NULL ma passo una data corretta: ho usato 
	cDBUtility.GetDate(connessione, cDBUtility.FormatoData.DataOra)
	   anzichè
	cDBUtility.GetDateTime(connessione, cDBUtility.FormatoData.DataOra)
ITEM <label class="argomento"></label> In fase di aggiornamento/creazione nodi nel nodo html+javascript non funziona la chiamata ai WS: 
- nell'app.js l'url è sbagliato (manca la porta? è http anzichè https?)
- nel web.Config del WS non sono stati scommentati i blocchi per l'installazione in HTTPS
- nell'app.js non non sono stati scommentati i blocchi per l'installazione in HTTPS
ITEM <label class="argomento VB"></label> Formattare un colonna come data per la gestione dell'ordinamento della colonna:
		If IsDate(item("Evasione").Text) Then
            item("Evasione").Text = Format(CDate(item("Evasione").Text), "dd/MM/yyyy")
        End If
ITEM <label class="argomento VB"></label> 
   OSS se devo fare a mano la gestione campi griglia stile cWinDef, la prima colonna utile ha indice 2

	Private Sub grdGriglia_ItemDataBound(sender As Object, e As GridItemEventArgs) Handles grdGriglia.ItemDataBound
        If e.Item.GetType.ToString = "Telerik.Web.UI.GridDataItem" Then
            Dim iColQta = 3
            If IsNumeric(e.Item.Cells(iColQta).Text()) Then e.Item.Cells(iColQta).Text() = FormatNumber(e.Item.Cells(iColQta).Text(), 0, , , TriState.True)
        End If
    End Sub
ITEM <label class="argomento VB"></label> Datatable to Dictionary
		''' &lt;summary&gt;
		''' Funzione che passato un datatable lo converte in dictionary di stringhe
		''' &lt;/summary&gt;
		''' &lt;param name="dt"&gt;Il datatable da convertire&lt;/param&gt;
		''' &lt;param name="nomeColChiave"&gt;Il nome della colonne contenente i valori chiave&lt;/param&gt;
		''' &lt;param name="nomeColValore"&gt;Il nome della colonne contenente i valori descrittivi&lt;/param&gt;
		''' &lt;returns&gt;&lt;/returns&gt;
		''' &lt;remarks&gt;&lt;/remarks&gt;
        Public Shared Function DtToDictionary(ByVal dt As DataTable, ByVal nomeColChiave As String, ByVal nomeColValore As String) As Dictionary(Of String, String)

           Try
            If dt IsNot Nothing Then
                Dim dictionary As Dictionary(Of String, String) = dt.AsEnumerable().ToDictionary(Of String, String)(
                Function(row) row.Field(Of String)(nomeColChiave),
                Function(row) row.Field(Of String)(nomeColValore)
            )

                Return dictionary
            Else
                Return Nothing
            End If
        Catch ex As Exception
            Return Nothing
        End Try        
    End Function
	
	oppure
	
	Public Shared Function DtTodictionary(ByVal dt As DataTable, ByVal nomeColChiave As String, ByVal nomeColValore As String) As Dictionary(Of String, String)
        Dim dict As New Dictionary(Of String, String)

        For Each r As DataRow In dt.Rows
            dict.Add(r(nomeColChiave), r(nomeColValore))
        Next
        Return dict
    End Function
ITEM <label class="argomento"></label> Non va il click sulla voce di menù ----> mancano riferimenti al CSS o al JS di bootstrap!
ITEM <label class="argomento VB"></label> Nuovo progetto con CBO del 2022: 
- in CBO e CBOUtil verificare che non sia presente la spunta MyProject/COmpilazione Registra per interoperabilità COM
- agg riferiemnti mancanti nelle CBO (2 Telerik + Rebex che è direttamente nella cartella della relativa cbo del progetto)
	cercare in 
	C:\\Program Files (x86)\\Progress\\Telerik UI for ASP.NET AJAX R2 2018\\Bin45
	C:\\Program Files (x86)\\Progress\\Telerik UI for ASP.NET AJAX R2 2018\\AdditionalLibraries\\Bin45
	E:\\NOMESOLUZIONE\\PROGETTO\\CboUtil\\Rebex
ITEM <label class="argomento VB"></label>   Telerik esportazione in Excel
- impostare la alrghezza in pixel delle colonna:
 worksheet.Columns(0).SetWidth(New Telerik.Windows.Documents.Spreadsheet.Model.ColumnWidth(75, True)) 'width in pixel
ITEM <label class="argomento VB"></label>Per personalizzare il tempo di timeout ed impostare i cookie:
(- la classe cCboCookie deve essere quella aggiornata!)
'Web.Config
	&lt;add key="SessionTimeout" value="20" /&gt; &lt;!--in minuti: personalizza il valore del cookie.Expires--&gt;
    &lt;!-- Login con Cookie --&gt;
    &lt;add key="CboCookie" value="1" /&gt;
'Global.asax
'imposto la durata della sessione
	If IsNumeric(CboUtil.BO.cFunzioni.CboAppSetting("SessionTimeout")) AndAlso CLng(CboUtil.BO.cFunzioni.CboAppSetting("SessionTimeout")) &gt; 0 Then
		HttpContext.Current.Session.Timeout = CboUtil.BO.cFunzioni.CboAppSetting("SessionTimeout")
	End If   
ITEM <label class="argomento VB"></label> RadComboBox con valori in aspx:
&lt;cbo:RadComboBox ID="cmbStatoContratto" runat="server" CheckBoxes="true" AllowCustomText="false" CheckedItemsTexts="DisplayAllInInput" Width="100%" DropDownWidth="300" style="max-width:196px;"&gt;            
                    &lt;Items&gt;
                        &lt;telerik:RadComboBoxItem Value="0" Text="Dati insufficienti" /&gt;
                        &lt;telerik:RadComboBoxItem Value="1" Text="Disdettato" /&gt;
                        &lt;telerik:RadComboBoxItem Value="2" Text="In disdetta" /&gt;
                        &lt;telerik:RadComboBoxItem Value="3" Text="In vigore" /&gt; 
                        &lt;telerik:RadComboBoxItem Value="4" Text="In scadenza a 30 gg." /&gt;    
                        &lt;telerik:RadComboBoxItem Value="5" Text="In scadenza" /&gt;               
                        &lt;telerik:RadComboBoxItem Value="6" Text="Scaduto" /&gt;                                                      
                    &lt;/Items&gt;
                &lt;/cbo:RadComboBox&gt;
ITEM <label class="argomento CSS"></label> CSS padre
non è possibile direttamente accedere al padre, tipo con maggiore e minore, ma è possibile fare così:
        td:has(.nomeClasse):hover {
            cursor:pointer;
            background: #ccc !important;
        }
ITEM <label class="argomento VB"></label> cWinDef: click su una colonna che clicca un bottone della browse
        'Gestione click sulla colonna "Impianto"
        Dim sItem As String = "Impianto"
        Dim lbl As New Label
        Dim id As String = item.Cells(item.Cells.Count() - 2).Controls(0).ClientID

        With lbl
            .ID = "lblImpianto_" & item("Codice").Text()
            .Text = item(sItem).Text
            .Attributes.Add("onclick", "$('#" & id & "').click();")
            .Attributes.Add("style", "cursor:pointer")
        End With
        item(sItem).Controls.Clear()
        item(sItem).Controls.Add(lbl)
ITEM <label class="argomento VB"></label>	
        Dim pathAllegato As String = cFunzioni.Nz(cDBUtility.DLookUp(Connessione, "Allegato", "kai_Allegati", "StatoAllegato = 3 AND ChiaveNum = " & txtCodice.Text), "")
        If pathAllegato <> "" Then
            Dim sNome As String = System.IO.Path.GetFileName(pathAllegato)

            Dim PathTmp As String
            PathTmp = "Tmp\" & Utente.UserID

            If Not System.IO.Directory.Exists(Request.PhysicalApplicationPath & PathTmp) Then
                System.IO.Directory.CreateDirectory(Request.PhysicalApplicationPath & PathTmp)
            End If

            System.IO.File.Copy(pathAllegato, Request.PhysicalApplicationPath & PathTmp & "\" & sNome, True)

            '--- Visualizzo il rapportino
            Dim sRedirect As String = "PdfJs/web/viewer.html?file=../../" & PathTmp & "\" & sNome & "?_=" & _
                                          Server.UrlEncode(CboUtil.Cryptography.cCryptography.EncryptTo3DES(cDBUtility.GetDate(Connessione, cDBUtility.FormatoData.DataOra), CBO.CRYPTKEY))
            cWindowHelper.Create(Me, sRedirect, "")
        End If 
ITEM <label class="argomento VB"></label> Riordinare un datatable:
DataTable.DefaultView.Sort = "ColumnName ASC"
DataTable = DataTable.DefaultView.ToTable
ITEM <label class="argomento VB"></label> Non riconosce il My.Settings.Proprieta ma nel web.Config è compilato =&gt; aprire il MyProject, così tutto torna a funzionare
ITEM <label class="argomento VB"></label> Impostare manualmente i valori del RadComboBox
			&lt;telerik:radcomboBox ID="cmbStatoOrd" runat="server" Width="100%" TypeControl="ComboBox" TypeData="Text" AccettaTesto="false" CheckBoxes="true" AllowCustomText="false" CheckedItemsTexts="DisplayAllInInput" &gt;
                &lt;Items&gt;
                    &lt;telerik:RadComboBoxItem Value="C" Text="In corso" /&gt;
                    &lt;telerik:RadComboBoxItem Value="A" Text="Da avviare" /&gt;
                    &lt;telerik:RadComboBoxItem Value="T" Text="Terminate" /&gt;
                &lt;/Items&gt;
            &lt;/telerik:radcomboBox&gt;
ITEM <label class="argomento JS"></label> telerik:RadWindow, finestra da usare invece dei Form Dialog ove possibile
ASPX:   
	&lt;telerik:RadWindow ID="RadWindow" runat="server" DestroyOnClose="true" Title="TITLE" Behaviors="Move, Resize, Close"&gt;
		&lt;ContentTemplate&gt;
			&lt;asp:Panel ID="pPanel" runat="server" style="font-size:16px"&gt;   
				&lt;div class="col-xs-12"  style="width:100%; height:10px"&gt;&lt;/div&gt;
				&lt;h4&gt;Modifica la quantità prodotta e rigenera i documenti di produzione&lt;/h4&gt;
				&lt;div class="col-xs-12"&gt;
					&lt;cbo:TextBox ID="txtIdProduzione" CssClass="hidden form-control" runat="server"&gt;&lt;/cbo:TextBox&gt;  
				&lt;/div&gt;   
				&lt;div class="col-xs-12" style="width:100%; height:10px"&gt;&lt;/div&gt;
				&lt;div class="col-xs-6"&gt;
					&lt;b&gt;Quantità salvata&lt;/b&gt;&lt;br /&gt;
					&lt;asp:Label runat="server" ID="lblQtaSalvata"&gt;&lt;/asp:Label&gt;
				&lt;/div&gt;			                                 
				&lt;div class="col-xs-12" style="width:100%; height:20px"&gt;&lt;/div&gt;
				&lt;div class="col-xs-6"&gt;                   
				   &lt;button id="btnChiudi" class="btn btn-success" style="width:100%"&gt;
						&lt;span class="glyphicon glyphicon-remove"&gt;&lt;/span&gt;
					&lt;/button&gt;
				&lt;/div&gt;
				&lt;div class="col-xs-6"&gt;
					&lt;button id="btnSalvaQta" class="btn btn-success" style="width:100%"&gt;
						&lt;span class="glyphicon glyphicon-ok"&gt;&lt;/span&gt;
					&lt;/button&gt;
				&lt;/div&gt;                             
			&lt;/asp:Panel&gt;
		&lt;/ContentTemplate&gt;
	&lt;/telerik:RadWindow&gt; 

JS :
///gestione form in sovraimpressione
$(document).ready(function () {

    $('#btnSalva').on('click', function () {
        if (event) event.preventDefault();
        Salva();
    });

    $('#btnChiudi').on('click', function () {
        ChiudiFormDialog();
        PulisciCampi();
    });
})

///gestione form in sovraimpressione 
function ApriFormDialog(IdProd, Utente, DataOra, QtaSalvata) {
    if (event) event.preventDefault();
	PulisciCampi(); //se chiudo dalla X può essere non pulisca i dati

    $('#ctl00_content_RadWindow_C_txtIdProduzione').val(IdProd);
    $('#ctl00_content_RadWindow_C_lblQtaSalvata').text(QtaSalvata);

    SetGraficaFormDialog()
    $find('ctl00_content_RadWindow').show();
}

function ChiudiFormDialog() {
    if (event) event.preventDefault();
    $find('ctl00_content_RadWindow').close();
    $find('ctl00_content_RadWindow').SetOffsetElementId('');
}

function SetGraficaFormDialog() {
    //Configuro graficamente il form
	let rwScheda = $find('ctl00_content_RadWindow');
    if (rwScheda) {
		rwScheda.set_height(350); //imposto altezza
		rwScheda.set_width(700); //imposto altezza           
		rwScheda.set_visibleTitlebar(true);
		rwScheda.set_visibleStatusbar(false);
		rwScheda.set_centerIfModal(true);
		rwScheda).set_modal(true);		
	}   
}

function PulisciCampi() {    
    $('#ctl00_content_RadWindow_C_txtIdProduzione').val('');
    $('#ctl00_content_RadWindow_C_lblQtaSalvata').text('');
}

function SalvaQta() {
    let json = "{'sIdProd':'" + $('#ctl00_content_RadWindow_C_txtIdProduzione').val() + "', 'iNuovaQta':'" + $('#ctl00_content_RadWindow_C_txtQtaNuova').val() + "'}"

    let b = eseguiPageMethod("StampaEtichettePF_B.aspx", "AggiornaQtaWS", json)
    if (b) {
        ChiudiFormDialog();
        PulisciCampi()
    } else {
        alert('Anomalia in fase di forzatura orario');
    }
}

ITEM <label class="argomento JS"></label> $('#ctl00_corpo_lblNoFoto').is(':visible')
ITEM <label class="argomento JS"></label> Usare queryString per la login su html:
LATO JS:

	$(document).ready(function () {
		debugger;
		let opQueryParam = new cProprieta();
		let op = new cProprieta();
		opQueryParam.Scrivi("", getQueryParams(document.URL))
		let bLoginClassica = false;

		if (opQueryParam.Leggi('NoQueryString') == '1' || opQueryParam.Leggi('') == '' ) {
			//autenticazione classica con inserimento manuale credenziali
			//             o
			//errore nella querystring passata
			bLoginClassica = true;
		}else{
			  //autenticazione con querystring        
			try {
				op.Scrivi('', callWebService('Autenticazione.svc', 'LoginViaQueryString', '{ "sParam" : "' + opQueryParam.Leggi('QueryString') + '" }'));
				if (op.Leggi('Errore') == '') {
					localStorage['CLK_Token'] = op.Leggi('Token');
					localStorage['CLK_RigaPersonaggio'] = op.Leggi('RigaPersonaggio');
					location.href = op.Leggi('Pagina');
				}
				else {
					alert(op.Leggi('Errore'));
					$('#txtPassword').val('')
					$('#txtUtente').val('')
				};
			}
			catch (error) {
				alert('Anomalia WS login\n' + error)
			}			
		}
	}

	function getQueryParams(url) {
		var op = new cProprieta();
		const paramArr = url.split('?')[1];
		if (paramArr === undefined) {
			op.Scrivi("NoQueryString", "1")
		} else {       
			op.Scrivi("NoQueryString", "0")        
			op.Scrivi("QueryString", decodeURIComponent(paramArr))
			return op.Leggi('')
		}
	}
	
Lato VB devo avere poi del codice del tipo 

	sParam = sParam.Replace("cboValue=", "")
	Dim sDecodificato = CboUtil.Cryptography.cCryptography.DecryptFrom3DES(sParam, CBO.Comune.CRYPTKEY)
	op.Scrivi("", sDecodificato)
	'La query string deve essere del tipo USERID=xxx?PASSWORD=xxx?PAGINA_HTML=xxx
	If cFunzioni.Nz(op.Leggi("USERID"), "") = "" Or cFunzioni.Nz(op.Leggi("PASSWORD"), "") = "" Or cFunzioni.Nz(op.Leggi("PAGINA_HTML"), "") = "" Then
		Throw New Exception()
	Else
		'eseguo la login

	End If
ITEM <label class="argomento"></label> MasterLiftDesk: se dice Utente già collegato:
scrivo nella login alfa/beta e premo invio --> si abilita il btn Pulisci file di log --> click e faccio la login con le mie credenziali
ITEM <label class="argomento JS"></label>     //intercetto il click dell'invio
    $("#divFiltri").keypress(function (e) {
        if (e.which == 13) {
            //click sul btnFiltra
            javascript: __doPostBack('ctl00$content$btnFiltra', '');
        }
        else {
            e.preventDefault
        }
    });
ITEM <label class="argomento VB"></label> Report: numero di pagina
		= PageNumber + ' / ' + PageCount
ITEM <label class="argomento VB"></label> Il Report personalizzato non parte o non viene trovato: non ho messo il nome del Namespace!
ITEM <label class="argomento JS"></label> Cookie - lato js
/** USARE al posto di XXXXXXXX il codice dell'applicazione corrente! */
function IsAuthCookieValid(){
    if (IsCookieValid('CBO_XXXXXXXX')) {
        return true;
    } else {
        alert('Autenticazione scaduta: verrete reindirizzati alla login');
        window.location.href = 'Login.aspx';   //La pagina ti reindirizza comunque alla login dopo TempoCookie + 10/20 secondi 
        //non dovrebbero servire, ma per evitare errori
        if (event) event.preventDefault();
        return false;
    }
}

function IsCookieValid(nome) {
    let bReturn = false;
    let arrCookies = document.cookie.split(';');
    if (arrCookies.length == 0) {
        alert('Nessun cookie presente: effettuare nuovamente l\'autenticazione');
        return false;
    } else {
        //ciclo l'array
        arrCookies.forEach(function (element) {
            //element è una stringa del tipo "NomeCookie=Valore"
            //se trovo una stringa che comincia con il nome desiderato ritorno true
            let regex = new RegExp(nome, 'i');
            if (regex.test(element.trim())) bReturn = true;
        });
        return bReturn;
    }
}
ITEM <label class="argomento VB"></label> Master Anagrafica Clienti/Fornitori --> inserisco le chiavi --> F6 Moduli ---> Modifica Chiavi

Query di creazione tabelle e query di update da lanciare sul database Master:

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mas_RBO_MCArt](
 [ID] [numeric](18, 0) NOT NULL,
 [StringaSQL] [varchar](5000) NULL,
 [AggId] [timestamp] NULL,
 CONSTRAINT [PK_mas_RBO_MCArt] PRIMARY KEY CLUSTERED 
(
 [ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mas_RBO_MCAna](
 [ID] [numeric](18, 0) NOT NULL,
 [StringaSQL] [varchar](5000) NULL,
 [AggId] [timestamp] NULL,
 CONSTRAINT [PK_mas_RBO_MCAna] PRIMARY KEY CLUSTERED 
(
 [ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


INSERT [dbo].[mas_RBO_MCAna] ([ID], [StringaSQL]) VALUES (CAST(1 AS Numeric(18, 0)), 
N'UPDATE ARDES_Produzione.dbo.ard_Produzioni_D SET Codana =''$Codana$''  WHERE Codana =''$OldCodana$''')
GO
INSERT [dbo].[mas_RBO_MCArt] ([ID], [StringaSQL]) VALUES (CAST(1 AS Numeric(18, 0)), 
N'UPDATE ARDES_Produzione.dbo.ard_ArticoliDati SET CodArt = ''$NewCodArt$'' WHERE CodArt = ''$OldCodArt$''')




ITEM <label class="argomento VB"></label> Regex in VB.NET
 Dim rgx As Regex = New Regex("\.xml", RegexOptions.IgnoreCase)
 sNomeFile = rgx.Replace(sNomeFile, "")
ITEM <label class="argomento VB"></label> Posso fare
CDate(opDati.Leggi("OperationEnd").Replace(".", "/")).ToString("dd/MM/yyyy 00:00:00")
ITEM <label class="argomento VB"></label> textbox ora
&lt;cbo:TextBox ID="txtOraOrdine" runat="server" TypeControl="TextBox" IsKey="false" DataField="OraOrdine" CssClass="form-control unstyled" Width="100px" style="text-align:center;" min="00.00" max="23.59" pattern="[0-9]{2}.[0-9]{2}" type="time"&gt;&lt;/cbo:TextBox&gt;
ITEM <label class="argomento VB"></label> Aprire e chiudere una connessione:
(dopo le property)
Private m_ConnessioneProd As CCboConnection

(nel codice)
'Istanzio la nuova connessione al database del magazzino di Cosmet
Dim CnnProdString As String = cFunzioni.Nz(cDBUtility.DLookUp(Connessione, "Valore", "cos_TabConfigurazione", "Codice = 'CnnProdStr'"), "")
m_ConnessioneProd = New CCboConnection(CnnProdString)
m_ConnessioneProd.Open()
.....
m_ConnessioneProd.Close()
ITEM <label class="argomento JS"></label>
In javascript per impostare nei filtri la data di oggi/ieri/domani, se non ho un db cui appoggiarmi, posso usare

function pGetOggi_Filtro() {
	return new Date().toISOString().substring(0,10)
}
function pGetIeri_Filtro() {
	var date = new Date();
	date.setDate(date.getDate() - 1);
	return date.toISOString().substring(0,10)
}
function pGetDomani_Filtro() {
	var date = new Date();
	date.setDate(date.getDate() + 1);
	return date.toISOString().substring(0,10)
}
ITEM <label class="argomento CSS"></label> /*Dichiaro variabili globali (.root) con i colori del cliente */
/*le posso poi accedere via var(--verdeFlamor)*/

:root {
  --verdeFlamor:   #009540; 
  --verdeFlamor04: #00954061; 
  --verdeFlamor06: #00954099; 
  --verdeFlamor08: #009540cc; 
}
ITEM <label class="argomento "></label>Master note varie

i) per aggiornare Master: lancio il setup del server, quando chiede di allineare il database il file xml è sotto E\\APPS\\ROB\\masterDemo.xml
ed uso le spunte Tutto il database + Importa tabelle RBO

ii) i progressivi posso no essere getsiti si ada noi sia da Master stesso:
	- se li gestiamo noi usiamo i campi Anno e N_Def     => il progressivo sarà della forma N_Def
	- se li gestisce master usiamo i campi Anno e N_Prov => il progressivo sarà della forma Anno + N_Prov
	
iii) Creo un ordine: 	Ordini Gestione Oridni (f2 sul tipo) specifico l'azienda f10 e f4 inserisco gli articoli uno per volta, poi esci
   Evado un ordine: Magazzino gestione Movimenti f2 sul cliente e seleziono l'ordine f4 importa e poi seleziono gli articoli arrivati:
   SE L'ARTICOLO è CONFIGURATO A LOTTI POSSO SPECIFICARE LOTTO A E LOTTO B
   (Anagrafica articolo -> pagina 2 spunta Gestione lotti)
   Dopo che ho cfeato l'ordine ed aggiunto righe di dettaglio devo cliccare su stampa per confermare l'ordine (e impostare Stato = 'C' nella mag_Dordini)!

iv) Per verificare il dettaglio di un ordine 
	Magazzino/Scheda Articolo/ Da Lotto (compilo) A Lotto (. + tab per usare lo stesso)
	F10 Conferma -> click sulla riga -> Dettaglio apre 2 form in sovraimpressione:
		-Dettaglio Movimento
		-Dettaglio Movimento (anno)(lotto) -> da qui posso vedere le info dei documenti associati a tale lotto
 v) FTipo = 'A' = Articolo
ITEM <label class="argomento VB"></label>Giochino fade/fadeout stile ardes_Produzione

function ApriAttivitaGiornaliera() {
    if ($('#ctl00_content_divAttivita').is(":visible")) {
        $('#ctl00_content_divAttivita').fadeOut("fast");
        $('#ctl00_content_lblIconaApri').removeClass("glyphicon glyphicon-resize-small").addClass("glyphicon glyphicon-fullscreen");
    }
    else {
        $('#ctl00_content_divAttivita').fadeIn("fast");
        $('#ctl00_content_lblIconaApri').removeClass("glyphicon glyphicon-fullscreen").addClass("glyphicon glyphicon-resize-small");
    }
}
ITEM <label class="argomento VB"></label>gestione scroll
function SalvaScroll(){
	sessionStorage[prefissoApp + '_pageYOffset'] = window.pageYOffset;
}
function EseguiScroll(){
	if (sessionStorage[prefissoApp + '_pageYOffset']){
		window.scrollTo({ top: sessionStorage[prefissoApp + '_pageYOffset'], behavior: 'smooth' });
	}	
}

ITEM <label class="argomento VB"></label>Modificare un datatable
	Dim iRighe As Integer = dtDati.Rows.Count
	For i As Integer = 0 To iRighe - 1
		If dtDati(i)("IdControllo") = "chk_RICHIESTAPREVENTIVO_Sì" Then
			dtDati(i)("IdControllo") = "chk_RICHIESTACOPIAPREVENTIVO_Sì"
		End If
		If dtDati(i)("IdControllo") = "chk_RICHIESTAPREVENTIVO_No" Then
			dtDati(i)("IdControllo") = "chk_RICHIESTACOPIAPREVENTIVO_No"
		End If
	Next
ITEM <label class="argomento VB"></label>IClassi_Read

	Public Overrides Function IClassi_Read(ByRef connessione As CCboConnection) As Boolean
		Dim bReturn As Boolean = MyBase.IClassi_Read(connessione)

		If IClassi_Proprieta.Leggi("EOF") <> "1" Then
			'accodo i campi della COSMET_Produzione.dbo.cos_Produzioni_D
			Dim m_StringaProprieta As New cProprieta
			cDBUtility.DB_Read(connessione, "SELECT * FROM cos_Produzioni_D WHERE WHERE Tipo = '" & IClassi_Proprieta.Leggi("Codice") & "' AND Anno = '" & IClassi_Proprieta.Leggi("Codice") & "' AND Numero = " & IClassi_Proprieta.Leggi("Codice") & " AND Riga = " & IClassi_Proprieta.Leggi("Codice"), m_StringaProprieta)
			m_StringaProprieta.Elimina("AggID") 'tengo solo AggID di partenza            

			'importo tutto lo stringone (non ci sono campi "uguali")
			IClassi_Proprieta.Scrivi("", CboUtil.BO.cFunzioni.ImpostaCProprietaToCProprieta(IClassi_Proprieta.Leggi, m_StringaProprieta.Leggi))
		End If

		Return bReturn
	End Function
ITEM <label class="argomento VB"></label> Creare a runtime bottoni e gestirne il click tramite AddHandler (con funzione che prendo in input parametri)
	'creo i bottoni a runtime
	Dim btn As New CBO.Web.UI.WebControls.Button
	btn.ID = "btnLayout_" & r("CodArt")
	btn.CssClass = "btn btn-success margin10"
	Dim sTipo As String = r("CodArt").replace("CFG_", "")
	btn.Text = sTipo
	AddHandler btn.Click, Function(sender, e) AggiungiLayout(sTipo)

	pBottoniLayout.Controls.Add(btn)
ITEM <label class="argomento VB"></label> Scrivere un file di testo
	Dim sPath as string = ""
	Dim sTestoFile as string = ""
	Dim file As System.IO.StreamWriter
	file = My.Computer.FileSystem.OpenTextFileWriter(sPath, True)
	file.WriteLine(sTestoFile)
	file.Close()
			
ITEM <label class="argomento VB"></label> Aggiungere un webmethod/webservice sulla pagina aspx:

#Region "WebServices"
    &lt;System.Web.Services.WebMethod()&gt; _
    Public Shared Function SetTab(ByVal tab As String) As String
        m_TabSelezionato = tab
        Return ""
    End Function
#End Region

ITEM <label class="argomento VB"></label> Leggre e Scrivere un file:
<b>LETTURA</b>
	Dim fileReader =  My.Computer.FileSystem.OpenTextFileReader("C:\testfile.txt")
	Dim stringReader = fileReader.ReadLine()

<b>SCRITTURA</b>
	Dim file As System.IO.StreamWriter
	file = My.Computer.FileSystem.OpenTextFileWriter(sPath, True)
	file.WriteLine(sProdOrderImp)
	file.Close()

ITEM <label class="argomento VB"></label> "Lunghezza obbligatoria" ---> sto usando un metodo di tipo POST e non passo nessun dato (sarebbe propriamente un GET...)
ITEM <label class="argomento VB"></label> Percorso del progetto:
	System.Web.HttpContext.Current.Request.PhysicalApplicationPath
ITEM <label class="argomento VB"></label> Quante volte passa nell'InitializeComponent del subReport?
ITEM <label class="argomento VB"></label> Aggiungere icona al sito: nella MasterPage.aspx
	&lt;link rel="icon" href="Images/icon32.png" sizes="32x32"/&gt;
	&lt;link rel="icon" href="Images/icon192.png" sizes="192x192"/&gt;
	&lt;link rel="apple-touch-icon" href="Images/icon180.png"/&gt;
ITEM <label class="argomento VB"></label> Il parametro di HR per visualizzare l'ID della telefonata è $CTO impostato ad 1
ITEM <label class="argomento VB"></label> Modo furbo per chiamare i WebMethod lato js

	let oJSON = {};
	oJSON['Lotto'] = Lotto;
	oJSON['RigaDBase'] = RigaDBase;
	oJSON['CodArt'] = CodArt;
	oJSON['RigaArt'] = RigaArt;
	oJSON['IdProd'] = $('#ctl00_content_lblIdProduzione').text();

	let b = eseguiPageMethod("mobDistintaBase.aspx", "EliminaRigaWS", JSON.stringify(oJSON));
ITEM <label class="argomento SQL"></label> Per avere tutti gli anni consecutivi da un certo anno fino ad adesso

WITH yearlist AS   (      
SELECT 2021 as year, 2001 as ordine     
UNION ALL      
SELECT yl.year + 1 AS year, yl.year + 1 AS ordine      
FROM yearlist yl     
WHERE yl.year + 1 %lt;= (YEAR(GETDATE()))  )    

SELECT Anno 
FROM   
	(SELECT '' as Anno, 3000 as ordine  
	UNION  
	SELECT CONVERT(varchar, year), ordine from yearlist
	) AS p  
ORDER BY p.ordine DESC  

ITEM <label class="argomento JS"></label>Creare un Set ( = insieme di valori unici) e riordinarlo

let uniqueTipologie =  new Set();
arrCoinvolti.forEach(function(element, index){
	if(element.Tipologia){
		
		arrTipi = element.Tipologia.split(";");
		arrTipi.forEach(function(element, index){
			uniqueTipologie.add(arrTipi[index]);
		});			
	}
});	
uniqueTipologie = [...uniqueTipologie].sort();
ITEM <label class="argomento VB"></label> cWinDef: colorare una riga
	For Each i As TableCell In item.Cells
		'i.Attributes.Add("class", "divisoreRiga") 'con la classe non funziona correttamente, viene sovrascritta!
		i.Attributes.CssStyle("background-color") = "#337ab7  !important"
		i.Attributes.CssStyle("color") = "#ffffff  !important"
		i.Attributes.CssStyle("border-top") = "solid 2px #878383 !important"
	Next 
ITEM <label class="argomento VB"></label> 	Aggiorna MasterLift .bat
rem --- Deregistra MasterLiftBridge
C:\\WINDOWS\\Microsoft.NET\\Framework\\v2.0.50727\\regasm.exe E:\\APPS\\MasterImpianti\\DllDotNet\\MasterLiftBridge.dll /u 

rem --- DEregistra CboUtil
C:\\WINDOWS\\Microsoft.NET\\Framework\\v2.0.50727\\regasm.exe E:\\APPS\\MasterImpianti\\DllDotNet\\CboUtil.dll /u 

pause

rem --- registra MasterLiftBridge
C:\\WINDOWS\\Microsoft.NET\\Framework\\v2.0.50727\\regasm.exe E:\\APPS\\MasterImpianti\\DllDotNet\\MasterLiftBridge.dll /codebase 

rem --- registra CboUtil
C:\\WINDOWS\\Microsoft.NET\\Framework\\v2.0.50727\\regasm.exe E:\\APPS\\MasterImpianti\\DllDotNet\\CboUtil.dll /codebase 

pause
ITEM <label class="argomento VB"></label> Eseguo il bind del cmb
            oDbWin = CInfoDBWin.GetInfoDBWin(enuAppPlatform.Web, Connessione, "SIGLA", CInfoDBWin.enuModalitaDBWin.F2, "pagina.aspx", "cmb", 1)
            cmbPressa.DataSource = cDBUtility.GetDataTable(oDbWin.SQLString, Connessione)
            cmbPressa.DataBind()
			
ITEM <label class="argomento VB"></label> Paginare la griglia senza usare la cWinDef:
m_oBrowse.PageSize = 20
grdGriglia.AllowPaging = True
ITEM <label class="argomento VB"></label> Verifica connessione:
Dim ConnessioneEPF As New CCboConnection

Try
	'Apro la connessione all'INVAT_EPF
	Dim sCnnString As String = cDBUtility.DLookUp(Connessione, "Valore", "inv_TabConfigurazione", " Codice = 'CnnStringE'")
	ConnessioneEPF = New CCboConnection(sCnnString)
	ConnessioneEPF.Open()
	
	' Non ha dato errore: Conessione OK
	divSemaforoVerde.Visible = True
	divSemaforoRosso.Visible = False
	ConnessioneEPF.Close()
Catch ex As Exception
	' Ha dato errore: Conessione KO
	If ConnessioneEPF IsNot Nothing AndAlso ConnessioneEPF.State = ConnectionState.Open Then
		ConnessioneEPF.Close()
	End If
	divSemaforoRosso.Visible = True
	divSemaforoVerde.Visible = False
End Try
ITEM <label class="argomento VB"></label> Per fare una chiamata API da Postman in cui si usa un bearer Token posso:
aggiungerlo nella tasca Authorization (<i>If you enter your auth details in the Authorization tab, Postman will automatically populate the relevant parts of the request for your chosen auth type.</i>) 
<img class='ImgAppunti' loading='lazy' src='Immagini\\img1.png'/>

oppure aggiungere nell'header 
Authorization con valore "Bearer TOKEN" mantenendo uno spazio dopo la string 'Bearer'!

<a href='https://learning.postman.com/docs/sending-requests/authorization/' class='Link'>Postman: Authorizing requests</a>
ITEM <label class="argomento VB"></label> Creare un Servizio Windows
Creazione Servizio Windows
1.	Apro la solution in cui voglio  craere il servizio
2.	Aggiungi nuovo progetto -> Servizio Windows (framework 4.5.1)
3.	Nel MyProject aggiungo riferimenti a CBO, CBOUTIL, eventuali DLL o RPT (nel caso anche la CBOSTAMPE): per tutti questi ‘Copia localmente’ impostato su TRUE
4.	Rinomino il file .vb in Main.vb
5.	Nel MyProject imposto come oggetto di avvio Main.vb
6.	Nel App.config aggiungo la stringa di connessione (con Language=US_English; )

Main.vb
0)	Attributi globali
Dim m_Connessione As CCboConnection
Dim WithEvents m_TimerRefresh As New Timers.Timer
1)	In cima al codice lascio (commentati) i comandi da lanciare per registrare e cancellare il servizio:
'sc create MyService binpath= E:\Sviluppo\...\MyService.exe start= auto
'sc delete MyService
(per avere dei path corretti, faccio ‘Compila’, prendo il percorso del .exe, lancio come amministratore il prompt dei comandi e lancio la stringa)

2)	Nell’OnStart 
-	faccio partire il servizio in ritardo per poterne effettuare il debug (commentato in fase di installazione presso il cliente)
-	creo una nuova Cultire per gestire il formato degli orari come 00.00 (e non 00:00)
-	istanzio la connessione
-	salvo nel log l’avvio
-	avvio un timer
'[]da commentare in produzione (serve per avere il tempo di agganciare il debugger di
 VS con "DEBUG->Connetti a processo...")
        Threading.Thread.Sleep(15000)        

Dim newCulture As CultureInfo = System.Threading.Thread.CurrentThread.CurrentCulture.Clone
        newCulture.DateTimeFormat.TimeSeparator = "."
        System.Threading.Thread.CurrentThread.CurrentCulture = newCulture

        m_Connessione = New CCboConnection(My.Settings.CnnString)
        m_Connessione.Open()

Comune.RegistraEvento(m_Connessione, My.Settings.CodApp, "SYSTEM", "Main", "Servizio viaggi avviato")

Me.m_TimerRefresh = New System.Timers.Timer(cParametri.rilParN("TRS", m_Connessione))   '  millisecond
        Me.m_TimerRefresh.AutoReset = True
Me.m_TimerRefresh.Start()

3)	Nell’evento TimerRefresh.Elapsed
-	ricreo la Culture
-	stoppo il timer (che altrimenti continuerebbe ad andare creando problemi), eseguo i miei metodi e lo riavvio
        
Dim newCulture As CultureInfo = System.Threading.Thread.CurrentThread.CurrentCulture.Clone
newCulture.DateTimeFormat.TimeSeparator = "."
System.Threading.Thread.CurrentThread.CurrentCulture = newCulture

      m_TimerRefresh.Stop()
‘MIEI METODI    
   m_TimerRefresh.Start()

ITEM <label class="argomento VB"></label>Chiamare una API da VB.NET  
	Dim myReader As StreamReader
	Dim myReq As HttpWebRequest
	Dim myResp As HttpWebResponse
	opRet.Scrivi("Esito", "")
	opRet.Scrivi("Messaggio", "")
	
	Try
		ServicePointManager.Expect100Continue = True
		ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12
		'ServicePointManager.ServerCertificateValidationCallback = AddressOf AccettaTuttiIcertificati (commentato, potrebbe non servire!)

		myReq = HttpWebRequest.Create(m_BaseUrl & "oauth2/access_token")
		With myReq
			.Method = "POST"
			.Accept = "*/*"
			.ContentType = "application/x-www-form-urlencoded" o ""application/json"" 'DA VERIFICARE!
		End With
		Dim postData As String = ""
		
		'---PASSO I DATI IN FORMATO x-www-form-urlencoded	
		'li scrivo nome=valore&nome_2=valore_2		
		Dim opData As New cProprieta
		opData.Scrivi("", cUtility.rilparT("BKE", mConnessione))		
		postData += "client_id=" & opData.Leggi("CLIENT_ID") & "&"
		postData += "client_secret=" & opData.Leggi("CLIENT_SECRET") & "&"
		postData += "grant_type=" & opData.Leggi("GRANT_TYPE") & "&"
		postData += "scope=" & opData.Leggi("SCOPE")
		postData = System.Web.HttpUtility.UrlDecode(postData)
		
		'---passo i dati in formato applicatio/json	            
		Dim opFoto As New cProprieta
		opFoto.Scrivi("", stringoneFoto)				
		postData += "{"
		postData += """IdTipoDocumento"": """ & opFoto.Leggi("IdTipoDocumento") & ""","
		postData += """Latitudine"": " & opFoto.Leggi("Latitudine") & ","
		postData += """Longitudine"": " & opFoto.Leggi("Longitudine") & ","
		postData += """Note"": """ & opFoto.Leggi("Note") & ""","
		postData += """Vano"": """ & opFoto.Leggi("Vano") & """"
		postData += "}"

		myReq.GetRequestStream.Write(System.Text.Encoding.UTF8.GetBytes(postData), 0, System.Text.Encoding.UTF8.GetBytes(postData).Count)
		myResp = myReq.GetResponse
		myReader = New System.IO.StreamReader(myResp.GetResponseStream)

		Dim sResponse As String = myReader.ReadToEnd

		'faccio il parsing del json      
		Dim serializer As New System.Web.Script.Serialization.JavaScriptSerializer
		Dim oResponse As Object = serializer.DeserializeObject(sResponse)

		opRet.Scrivi("Esito", oResponse("result").Trim())
		opRet.Scrivi("Messaggio", oResponse("resultTxt"))
		
	Catch ex As WebException
		Dim sError As String = ""
		Using readerErr = New StreamReader(ex.Response.GetResponseStream)
			sError = readerErr.ReadToEnd
		End Using
		opRet.Scrivi("Esito", "400")
		opRet.Scrivi("Messaggio", ex.Message & ". " & sError)

	Catch ex As Exception

		opRet.Scrivi("Esito", "400")
		opRet.Scrivi("Messaggio", ex.Message)
	End Try
ITEM <label class="argomento VB"></label>        
	''' Imposta la data secondo l'UTC e la restituisce formattata come "2023-03-24T15:56:32+00:00"
    ''' </summary>
    ''' <param name="dateIta"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Private Shared Function pDateToISO8601(ByVal dateIta As DateTime) As String
        ' https://code-maze.com/convert-datetime-to-iso-8601-string-csharp/
        'uso \: sennò scrive le ore con il punto anzichè i :        
        Dim sRet As String = dateIta.ToUniversalTime().ToString("yyyy-MM-ddTHH\:mm\:ss+00\:00")
        Return sRet
    End Function
ITEM <label class="argomento VB"></label>La query da risultati doversi tra SQL e VB => manca il Current Language=US_English nella Connection String
ITEM <label class="argomento VB"></label> Colorare il background del logo:
	.navbar-brand > div > img {
		border-radius: 5px;
		background-color: #FFF;
	}
ITEM <label class="argomento VB"></label> RegExp
- Selezionare un testo che non contiene una data stringa
	[^DA_ESCLUDERE]TESTO_DA_CERCARE
ITEM <label class="argomento VB"></label>Come aprire un accdb:<br>
premo shift + invio per aprire il file 
componenti aggiuntivi e scelgo la voce di menu (non richeide login)
dal menu a dx tasto destro sulla pagina: Visualizza Struttura
OPPURE
CLICK SULLA PAGINA E POI TASTO DX SULLL'ELEMENTO VISUALIZZA STRUTTURA	
ITEM <label class="argomento VB"></label> Aggiornare MasterLift Desk:
0) Sostitusco i file accdb e accde con quelli aggiornati
1)lancio il .bat che deregistra COME AMMINISTRATORE
2) al primo pausa nella cartella elimino le vecchie dll, prendo le nuove e le copio nella cartella
3)invio sul prompt
4) finito, apro con SHIFT + click il file .accde
5) Componenti aggiunti -> Servizi -> cambio società -> seleziono il db Master
6) vado su chiamate e clicco su non assegnata: se me la fa assegnare le dll sono a posto
7) per l’accdb ripeto 4-5-6
8) al click su mAccesso eseguo la login posso girare per l’accde loggato 
-----------------------------------------------------------------------------
Il bat è un file con i comandi seguenti:
rem === DEregistra MasterLiftBridge
C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\regasm.exe E:\APPS\MasterImpianti\DllDotNet\MasterLiftBridge.dll /u 
rem --- DEregistra CboUtil
C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\regasm.exe E:\APPS\MasterImpianti\DllDotNet\CboUtil.dll /u 

pause
rem --- registra MasterLiftBridge
C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\regasm.exe E:\APPS\MasterImpianti\DllDotNet\MasterLiftBridge.dll /codebase 
rem --- registra CboUtil
C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\regasm.exe E:\APPS\MasterImpianti\DllDotNet\CboUtil.dll /codebase 
pause

ITEM <label class="argomento VB"></label> Servizio Touch Keyboard da Crovara sistemato.

(lanciarli in una volta sol)

0)	Disabilitare il servizio Touch Keyboard and Handwriting Panel Service
sc query TabletInputService
sc config TabletInputService start=disabled


1)	Per ogni utente loggato vengono creati dei processi TabTip , kill per tutti
taskkill /IM "TabTip32.exe" /F
taskkill /IM "TabTip.exe" /F

2)	Per arrestare il servizio (se non si riesce da services.msc) kill del processo svchost corrispondente, oppure riavviare il server. 
tasklist /svc | find "svchost.exe" | find " TabletInputService"
taskkill /F /PID pid_restituito_da_tasklist
sc query TabletInputService
ITEM <label class="argomento VB"></label> Zoomare una pagina html:
	var scale = 'scale(1)';
	document.body.style.webkitTransform =  scale;    // Chrome, Opera, Safari
	document.body.style.msTransform =   scale;       // IE 9
	document.body.style.transform = scale;     // General
ITEM <label class="argomento VB"></label> Per personalizzare il colore dell'evidenziazione dela testo tramite cursore devo usare la pseudo-class
	::selection {
	background-color: #ffa534;
	color: #ff44fa;
	}
ITEM <label class="argomento SQL"></label>Per usare in SQL Exec:
dichiaro una stringa in cui tutti gli apici devono essere raddoppiati
e poi la eseguo come query

DECLARE @TipiOrdine as varchar(20)
DECLARE @StrSql as varchar(MAX)
SET @TipiOrdine = (SELECT part FROM Parametri where CodPar = 'DON')

SET @StrSql='
SELECT 
Tipo + ''/'' + Anno + ''/'' + CAST(Numero as varchar(10)) + ''/'' + CAST(Riga as varchar(10))  AS [RifOrdine], CodArt
FROM $txtValueHid$.dbo.mag_DOrdini
WHERE Tipo IN (' + @TipiOrdine + ')
AND CodArt = ''$txtCodArt$''
'
EXEC (@StrSql)
ITEM <label class="argomento VB"></label>Eliminare riga dal datatable di una cBrowseToScreen:
        m_Articoli.DtSchedeProdotto.AcceptChanges()
        Dim Counter As Integer = 0
        For Each row In m_Articoli.DtSchedeProdotto.Rows               
            m_Articoli.DtSchedeProdotto.Rows(Counter).Delete()
            Counter += 1
        Next
        m_Articoli.DtSchedeProdotto.AcceptChanges()
       
ITEM <label class="argomento VB"></label>	
	&lt;div class="col-xs-6 col-sm-3 col-md-3 col-lg-2" style="padding-left:20px"&gt;                                       
		&lt;asp:LinkButton id="btnEsportaExcel" runat="server" CssClass="btn btn-warning" Width="160"&gt;
			&lt;span class="glyphicon glyphicon-share-alt"&gt;&lt;/span&gt;&nbsp;&lt;span&gt;Esporta su Excel&lt;/span&gt;
		&lt;/asp:LinkButton&gt;
	&lt;/div&gt; 

	Private Sub btnEsportaExcel_Click(sender As Object, e As EventArgs) Handles btnEsportaExcel.Click
        Dim dt As DataTable = m_oBrowse.RecordsetFiltrato
        Dim nomeFile As String = "ElencoFormazione"

        If Not dt Is Nothing AndAlso dt.Rows.Count &gt; 0 Then
            Dim sPathFile As String = Request.PhysicalApplicationPath & "Tmp\" & Utente.UserID & "\"
            If Not System.IO.Directory.Exists(sPathFile) Then System.IO.Directory.CreateDirectory(sPathFile)
            sPathFile += nomeFile + ".xlsx"

            If EsportaSuExcel(sPathFile, dt) Then
                Response.Redirect("Tmp\" & Utente.UserID & "\" + nomeFile + ".xlsx")
            Else
                Dim oMsg As New cMsg(Me, "Impossibile esportare i dati su Excel")
                MasterLiftDLL.cEventi.Registra(Connessione, MasterHR.Web.UI.Page.Utente.UserID, Me.Path, "Anomalia: impossibile esportare i dati su Excel")
                oMsg.Show()
            End If
        End If
    End Sub

    Public Function EsportaSuExcel(ByVal sPathFile As String, ByVal dt As DataTable, Optional ByVal EscludiColonne As String = "") As Boolean
        Try
            Dim workbook As New Telerik.Windows.Documents.Spreadsheet.Model.Workbook
            Dim worksheet As Telerik.Windows.Documents.Spreadsheet.Model.Worksheet = workbook.Worksheets.Add()

            Dim dtFiltrato As DataTable = dt

            Dim iCol As Integer = -1
            For Each c As DataColumn In dtFiltrato.Columns
                If c.ColumnName &lt;&gt; "" And c.ColumnName &lt;&gt; " " And Microsoft.VisualBasic.Left(c.ColumnName, 1) &lt;&gt; "*" And c.ColumnName &lt;&gt; "AggID" Then
                    If Not EscludiColonne.Split(",").Contains(c.ColumnName) Then
                        Dim iRow As Integer = 0
                        iCol += 1

                        worksheet.Cells(iRow, iCol).SetValue(c.ColumnName.Replace("@", "").Replace("#", ""))
                        worksheet.Cells(iRow, iCol).SetIsBold(True)

                        'For Each r As DataRow In m_RecordSet.Rows
                        For Each r As DataRow In dtFiltrato.Rows
                            iRow += 1

                            'controllo formato
                            'se DateTime verifico se impostarlo a "dd/MM/yyyy" (orario 00:00:000), oppure "HH.mm" (orario &lt;&gt; 00:00:000)
                            'se &lt;&gt; DateTime imposto come testo
                            Select Case c.DataType.FullName
                                Case "System.DateTime"
                                    If IsDate(r(c.ColumnName)) Then
                                        If CDate(r(c.ColumnName)).Hour = 0 And CDate(r(c.ColumnName)).Minute = 0 And CDate(r(c.ColumnName)).Second = 0 And CDate(r(c.ColumnName)).Millisecond = 0 Then
                                            worksheet.Cells(iRow, iCol).SetFormat(New Telerik.Windows.Documents.Spreadsheet.Model.CellValueFormat("dd/MM/yyyy"))
                                        Else
                                            worksheet.Cells(iRow, iCol).SetFormat(New Telerik.Windows.Documents.Spreadsheet.Model.CellValueFormat("HH:mm"))
                                        End If
                                    End If
                                    ''Case "System.Decimal"
                                    ''    non avendo a disposizione la precisione per il momento lo imposto come testo
                                Case Else
                                    worksheet.Cells(iRow, iCol).SetFormat(New Telerik.Windows.Documents.Spreadsheet.Model.CellValueFormat("@"))
                            End Select

                            worksheet.Cells(iRow, iCol).SetValue(cFunzioni.Nz(r(c.ColumnName), ""))
                        Next
                    End If
                End If
            Next

            Dim colSelection As Telerik.Windows.Documents.Spreadsheet.Model.ColumnSelection = worksheet.Columns(0, iCol + 1)
            colSelection.AutoFitWidth()

            workbook.ActiveWorksheet.ViewState.FreezePanes(1, 0)

            Using fs As New System.IO.FileStream(sPathFile, System.IO.FileMode.Create)
                Dim provider As New Telerik.Windows.Documents.Spreadsheet.FormatProviders.OpenXml.Xlsx.XlsxFormatProvider()
                provider.Export(worksheet.Workbook, fs)
            End Using

            If System.IO.File.Exists(sPathFile) Then
                Return True
            Else
                Return False
            End If
        Catch ex As Exception
            Return False
        End Try
    End Function
ITEM <label class="argomento VB"></label>
/************Nascondo il testo in fondo al FormDialog *******/
.rwStatusBar {
    display:none !important;
}
ITEM <label class="argomento SQL"></label>Creare una nuova Function in SQL:
se dopo che la ho creata tramite script ricevo il messaggio di errore
<i> is not a recognized built-in function name</i>
è perchè quando la chiamo devo anteporre <b>dbo.</b> al nome della funzione!
ITEM <label class="argomento VB"></label> Master per cambiare/visualizzare le credenziali e la password di un untete:
Servizi -> Configurazione -> Utenti
ITEM <label class="argomento VB"></label>Tabelle temporanee:
le tabelle con nome ##myTab sono tabelle temporanee globali visibili a tutti gli utenti,
quelle locali invece sono visibili solo nel contesto in cui soni state create
ITEM <label class="argomento VB"></label>Tabelle temporanee:
Per creare in modo "giusto" lato VB delle tabelle temporanee ##TMP_Scadenzario e fare riferimento alla classe di MasterHR cRinnovoScadContratti
Nella cUtilitySqlTmp posso poi trovare il metodo per ottenere il nome completo della tabella tmp a partire dal nome base (il nome della tabella è formato da nome + user + numeri random)
<br>Le tabelle temporanee sono poi visibili sotto <b> System Databases &gt; tempdb &gt; Temporary Tables </b>
ITEM <label class="argomento VB"></label> Nei report per associare il datasource devo fare:
Proprietà del report &rarr; DataSource &rarr; new SQL DataSource &rarr; scrivo la query
Poi lato VB aggiungo
    Private Sub rEstrattoConto_Default_ItemDataBinding(sender As Object, e As EventArgs) Handles Me.ItemDataBinding
        Dim sSql As String = Me.SqlDataSource1.SelectCommand        
        Dim dtSource As DataTable = cDBUtility.GetDataTable(sSql, Me.CboConnection)
        TryCast(sender, Telerik.Reporting.Processing.Report).DataSource = dtSource
    End Sub
Qualora mancasse la seconda parte avrei l'errore CommandText
ITEM <label class="argomento VB"></label> Nei report per aggiungere un raggruppamento &rarr; tasto destro sul report Group:
<img class='ImgAppunti' loading='lazy' src='Immagini\\groups.png'/>
ITEM <label class="argomento VB"></label>Se sono in un dominio per accedere ad un disco (es. C) per cui non ho gli accessi posso fare
\\\\INDIRIZZO_IP\\c$
(il $ serve a forzare l'apertura senza i permessi)
ITEM <label class="argomento VB"></label>COME SEGNARE LE ATTIVITA' PER MASTER TRASPORTI
-------------------------------------------------------------
trasporto unito service
PERSONALIZZAZIONE: AD INIZIO DESCRIZIONE IN MAIUSCOLO IL CLIENTE (ES. LIBRANDI)
E A CAPO COSA SI è FATTO

PER GLI SVILUPPI: NON à NECESSARIO SCRIVRE IL NOME DEL CLIENTE IN CIMA, SEMMAI ANNEGATO NEL TESTO

ASSISTENZA: SCRIVO IL NOME DEL CLIENTE IN CIMA
-------------------------------------------------------------
tuit srl
SEGNO SOLO ATT PER WS CHE USANO TUIT,INVIO AL PORTO

---X normale per i nostri clienti---------------------------
pline
cf
cbox
de negri
ITEM <label class="argomento VB"></label>Per mettere gli a capo in Notepad++
<img class='ImgAppunti' loading='lazy' src='Immagini\\acapo.png'/>
ITEM <label class="argomento VB"></label>nel base.css
/************Nascondo il testo in fondo al FormDialog *******/
.rwStatusBar {
    display:none !important;
}
ITEM <label class="argomento VB"></label> Nel Web.Config per aumentare la durata della sessione modificare il tag <i>httpRuntime</i>: 
&lt;httpRuntime targetFramework="4.5.1" executionTimeout="600" /&gt;
ITEM <label class="argomento VB"></label> 'Personalizzare la gestione tabelle esempio:

Ho 2 campi chiave:
Uno visibile e obbligatorio     [TipoTank]
Uno nascosto e NON obbligatorio [IdSpecifica]

Private Sub Page_PreRender2(sender As Object, e As EventArgs) Handles Me.PreRender
	Select Case GestioneTabelle.MenuSelezionato
		Case "tnk_TabSpecificaTank"
			Dim txt As New CBO.Web.UI.WebControls.TextBox
			txt = ControlFinder.PageFindControl(Me, "IdSpecifica")
			If txt.Text = "" Then
				'Sono in inserimento chiavi   - forzo in questo evento la scrittura a 0 sennò poi da errore in fase di salvataggio              
				txt.Text = "0"
			Else
				'sono in modifica
			End If
	End Select
End Sub	
	
Private Sub m_ScreenTabelle_FCODE(ByRef keyPress As Integer, ByRef shift As Integer) Handles m_ScreenTabelle.FCODE
	If keyPress = System.Windows.Forms.Keys.F10 Then

		Select Case GestioneTabelle.MenuSelezionato
			Case "tnk_TabSpecificaTank"
				Dim txt As New CBO.Web.UI.WebControls.TextBox
				txt = ControlFinder.PageFindControl(Me, "IdSpecifica")
				Dim cmb As New CBO.Web.UI.WebControls.DropDownList
				cmb = ControlFinder.PageFindControl(Me, "TipoTank")

				Dim op As cProprieta = GestioneTabelle.oScreen.Classe.IClassi_Proprieta
				If txt.Text = "0" Then
					Dim iIdSpecifica As Integer = cFunzioni.Nz(cDBUtility.DMax(Connessione, "IdSpecifica", "tnk_TabSpecificaTank", "TipoTank = '" & cmb.SelectedValue & "'"), 0) + 1
					txt.Text = iIdSpecifica
				End If
		End Select
	End If
End Sub
ITEM <label class="argomento QUERY_UTILI"></label> 
Query utile per PULIRE IL DATABASE DALLE PRODUZIONI su Flamor

DECLARE @Lotto as varchar(20)
SET @Lotto = '''2300012'''
DECLARE @sSQL as varchar(MAX)
DECLARE @IsSacca as bit
SET @IsSacca = 0

SET @sSQL = (
SELECT CASE @IsSacca
WHEN 1 THEN 'UPDATE fla_Produzioni_D
SET Eseguito = 0,
DataFineProd = NULL,
DataIniProd = NULL,
OraFineProd = NULL,
OraIniProd = NULL
WHERE NumeroLotto = ' + @Lotto
ELSE
'UPDATE fla_Produzioni_D
SET Eseguito = 0,
DataFineProd = NULL,
DataIniProd = NULL,
OraFineProd = NULL,
OraIniProd = NULL
FROM fla_Produzioni_D
LEFT JOIN fla_Zaini ON fla_Zaini.IdLinea = fla_Produzioni_D.IdLinea
AND fla_Zaini.IdRiga = fla_Produzioni_D.IdRiga
WHERE fla_Zaini.NumeroLotto = ' + @Lotto 
END AS sSQL)
 
EXEC(@sSQL)
EXEC('DELETE FROM fla_DBaseProduzioni_T WHERE Lotto = ' + @Lotto)
EXEC('DELETE FROM fla_DBaseProduzioni_D WHERE Lotto = ' + @Lotto) 
ITEM <label class="argomento VB"></label> Passare da codice un ReportParameter:

1)  Dim opParam As New cProprieta	
	opParam.Scrivi("DbMaster", dbMaster)
	cStampa.ApriStampa("Produzione", "Elenco", opParam)
	
2) Sul report lo passo poi al subreport:

	Dim sReportParamater As String = "DbMaster"
	If Not SrRigheProduzione1.ReportParameters.Contains(sReportParamater) Then
		Dim p As New ReportParameter
		p.Value = IStampe_StringoneParam.Leggi(sReportParamater)
		p.Name = sReportParamater
		SrRigheProduzione1.ReportParameters.Add(p)
	End If  
	
3) Per 	poi ottenere il valore del parametro:
	Dim rp As ReportParameter
	rp = Me.ReportParameters("DbMaster")
	Dim dbMaster As String = rp.Value
ITEM <label class="argomento VB"></label> Array in VB.NET
Nel costruttore passo n -> crea un array di lunghezza n+1

Dim arr(2) As String
	arr(0) = r("LottoProd")
	arr(1) = r("Inizio")
	arr(2) = r("UltimaStampata")
ITEM <label class="argomento VB"></label>Dictionary di array:	
m_DictStampate = New Dictionary(Of String, String())
If m_DictStampate.ContainsKey("valore_chiave") Then
	Dim arr As String() = m_DictStampate("valore_chiave")

	e.Item.Cells(Indici.PrimaStampata).Text = arr(1)
	...
End If	
ITEM <label class="argomento VB"></label>Se ho una query che va a toccare dati su due tabelle  che riseidono su server distinti:
1) nella pagina
Public m_DictStampate As Dictionary(Of String, String())

2) Nell'Init
	apro la connessione all'atro server
    popolo un Dictionary con tutti i dati che mi servono:
	
	Dim CnnStringE As String = cFunzioni.Nz(cDBUtility.DLookUp(Connessione, "Valore", "inv_TabConfigurazione", "Codice = 'CnnStringE'"), "")
	Dim m_ConnShibaura As CCboConnection = New CCboConnection(CnnStringE)
	m_ConnShibaura.Open()
	
	m_DictStampate = New Dictionary(Of String, String()) 'pulisco il dictionary
	Dim oRboWin As CInfoDBWin = CInfoDBWin.GetInfoDBWin(enuAppPlatform.Web, Connessione, "inv", CInfoDBWin.enuModalitaDBWin.F2, "GiacenzaWMS_B.aspx", "CassoniMaturi", "1")
	Dim sSQL As String = oRboWin.SQLString
	Dim dt As DataTable = cDBUtility.GetDataTable(sSQL, m_ConnShibaura)
	m_ConnShibaura.Close()

	'Passo i dati dal dt al Dictionary (per comodità sarà poi più utile questo che un datatable)
	For Each r As DataRow In dt.Rows
		Dim arr(5) As String
		arr(0) = r("LottoProd")
		arr(1) = r("Inizio")
		arr(2) = r("UltimaStampata")
		arr(3) = r("Stampate")
		arr(4) = r("StampateOk")
		arr(5) = r("StampateNotGood")
		m_DictStampate.Add(r("LottoProd"), arr)
	Next
	
3) Nell'ItemDataBound o nella cWinDef compilo a mano le colonne inserite, ma lasciate vuote nella query:

	Private Sub grdGriglia_ItemDataBound(sender As Object, e As GridItemEventArgs) Handles grdGriglia.ItemDataBound
		If m_DictStampate.ContainsKey("valore_chiave") Then
			Dim arr As String() = m_DictStampate("valore_chiave")

			e.Item.Cells(Indici.PrimaStampata).Text = arr(1)
			e.Item.Cells(Indici.UltimaStampata).Text = arr(2)
			e.Item.Cells(Indici.StampateTotale).Text = arr(3)
			e.Item.Cells(Indici.StampataOK).Text = arr(4)
			e.Item.Cells(Indici.StampateNG).Text = arr(5)
		End If
	End Sub
	
	oppure nella cWinDef
	
	Private Sub GiacenzaWMS_B__grdGriglia__1__Righe(ByRef item As Telerik.Web.UI.GridDataItem, ByRef CboObject As Object)
		'Paolo 30/5/23 aggiungo l'info dei cassoni e pezzi maturati
		If GiacenzaWMS_B.m_dictArticolimaturi.ContainsKey(item("#idarticolo").Text) Then
			Dim arr As String() = GiacenzaWMS_B.m_dictArticolimaturi(item("#idarticolo").Text)
			item("QtaMaturata").Text = FormatNumber(cFunzioni.Nz(arr(0), "0"), 0, , , TriState.True)
			item("CassoniMaturati").Text = FormatNumber(cFunzioni.Nz(arr(1), "0"), 0, , , TriState.True)
		End If
	End Sub
ITEM <label class="argomento CSS"></label>CSS notevoli:
	<b>overflow-x: hidden;</b> 	  /*evita lo scroll orizzontale*/
	<b>white-space: pre;</b>  	 /*gestione a capi*/
	<b>outline: none;</b>       /*quando metto il fuoco non mostra i bordi della textarea*/ 
	<b>pointer-events:none</b> /*rimuove click*/
	<b>scale: 1.1;</b>
	<b>text-decoration: underline;</b>
	<b>filter: drop-shadow(1px 2px 1px #ccc);</b>
	
	/*gestione immagine come sfondo del div*/
	<b>background-image: url("Images/PressaStilizzata.svg");
	background-size: contain;
	background-repeat: no-repeat;</b>
	
	/*effetto grafico del loading:*/
	.rotazione {
		animation: rotation 2s infinite linear;
	}
	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}
ITEM <label class="argomento CSS"></label>Svg che ruota:
	<svg class="rotazione" width="30" height="30" viewBox="0 0 160 160" style="margin-right: 80px;">
		<circle r="70" cx="80" cy="80" fill="transparent" stroke="#FFFFFF" stroke-width="12px"></circle>
		<circle r="70" cx="80" cy="80" fill="transparent" stroke="#057b5f" stroke-width="12px" stroke-dasharray="439.6px" stroke-dashoffset="109.9px"></circle>
	</svg>
ITEM <label class="argomento VB"></label>Invio mail con link per aprire pagina:	
    Private Shared Sub pInviaMailTermineVerifica(ByRef oConnessione As CCboConnection, ByRef oConnessioneMaster As CCboConnection, ByVal sEmail As String, ByVal codPersona As String, ByRef opverifica As cProprieta)
		Dim sTestoMail As String = ""
        
        'Creo il link : cerco le credenziali per l'autologin
        Dim sUserId As String = cFunzioni.Nz(cDBUtility.DLookUp(Connessione, "UtenteWeb", "AnaPersone", "Cod_Persona='" & codPersona & "'"), "")
        Dim sPassword As String = cFunzioni.Nz(cDBUtility.DLookUp(Connessione, "PasswordWeb", "AnaPersone", "Cod_Persona='" & codPersona & "'"), "")

        Dim opParam As New cProprieta
        opParam.Scrivi("UserId", sUserId)
        opParam.Scrivi("Password", sPassword)
        opParam.Scrivi("Pagina_aspx", "VerificheElenco_B.aspx")
		'properrty da passare alla pagina e da intercettare nell'Autologin() della Login.aspx!
        
        Dim slink As String = cUtilityProduzione.rilparT("PRO", Connessione) 'url del programma
        If Right(slink, 1) &lt;&gt; "/" Then slink += "/"
        slink += "Login.aspx?cboValueDesktop=" & HttpUtility.UrlEncode(cCryptography.EncryptTo3DES(opParam.Leggi, CBO.Comune.CRYPTKEY))
		'OSS: su Invat è cboValueDesktop, di solito invece è cboValue

        sTestoMail += "&lt;br/&gt;"
        sTestoMail += "&lt;a href=""" & slink & """&gt;Clicca qui per visualizzare la verifica pezzi&lt;/a&gt;"

        'preparo oggetto mail
        Dim objMail As New cMail
        objMail.Mittente = CboUtil.BO.cFunzioni.CboAppSetting("Mail")
        objMail.DescrizioneMittente = CboUtil.BO.cFunzioni.CboAppSetting("MailDesc")
        objMail.IndirizziCCn = CboUtil.BO.cFunzioni.CboAppSetting("MailCcn")
        objMail.SmtpServer = CboUtil.BO.cFunzioni.CboAppSetting("SmtpServer")
        objMail.SmtpPort = CboUtil.BO.cFunzioni.CboAppSetting("SmtpPort")
        objMail.SmtpUser = CboUtil.BO.cFunzioni.CboAppSetting("SmtpUser")
        objMail.SmtpPassword = CboUtil.BO.cFunzioni.CboAppSetting("SmtpPassword")
        objMail.SmtpEnableSsl = CBool(CboUtil.BO.cFunzioni.CboAppSetting("SmtpEnableSsl"))
        objMail.Destinatario = sEmail
        objMail.Oggetto = "Notifica Fine verifica pezzi"
        objMail.Mail = sTestoMail

        'invio la mail
        Dim bInvioMail As Boolean = objMail.InviaMail()
        If bInvioMail Then
            cEventi.Registra(InvatProduzione.Page.Connessione, InvatProduzione.Page.Utente.UserID, "CassoniVerificheMobile_S", "Invio mail fine verifica pezzi a [" & sEmail & "]")
        Else
            cEventi.Registra(InvatProduzione.Page.Connessione, InvatProduzione.Page.Utente.UserID, "CassoniVerificheMobile_S", "Anomalia Invio mail fine verifica pezzi a [" & sEmail & "]")
        End If
	End Sub 
ITEM <label class="argomento VB"></label> Da numero a data:
DateTime.FromOADate(Double d)
The d parameter is a double-precision floating-point number that represents a date as the number of days before or after the base date, midnight, 30 December 1899.
ITEM <label class="argomento VB"></label>'LETTURA FILE EXCEL ==============================
	Dim formatProvider As XlsxFormatProvider = New XlsxFormatProvider()
	fs = File.Open(opParam.Leggi("PathFile"), FileMode.Open)
	Dim workbook As Workbook = formatProvider.Import(fs)
	Dim worksheet = TryCast(workbook.Sheets(0), Worksheet)

	fs.Close()

	'salto la prima riga con l'intestazione
	Dim iRow As Integer = 0 'lavora in base 0 

	Dim bEndOfRows As Boolean = False

	Dim iRigheVuote As Integer = 0
	Do While iRigheVuote < 3
		Dim opAltriDati As New cProprieta
		iRow += 1
		
		'leggo tramite pReadCell(worksheet, iRow, 12))
	Next
			
	Private Shared Function pReadCell(ByRef WorkSheet As Telerik.Windows.Documents.Spreadsheet.Model.Worksheet, ByVal iRiga As Integer, ByVal iCol As Integer) As String        
        Return WorkSheet.Cells(iRiga, iCol).GetValue().Value.RawValue.ToString().Trim()
    End Function
ITEM <label class="argomento VB"></label> Importare pagine da un altro progetto
Dopo aver creato le nuove pagine ed avervi incollato aspx/vb
1) replace delle sigle ('kai' con 'tnk')
2) replace del nome della pagina se modificato
3) nell'aspx modificare la testata con i valori corretti di CodeBehind e di Inherits
3*)nell'aspx e in ID="Content2" attenzione a ContentPlaceHolderID che abbia il valore corretto
4) nel vb adeguare l'Inherits
5) Riportare la classe VB base dei form 
5) Riportare eventuali rbowin collegate
6) riportare eventuali file js (attenzione ad eventuali _corpo_ o _body_, vedi (3*))
7) Riportare metodi nella cWinDef
8) Attenzione agli ShowLoading che siano definiti
ITEM <label class="argomento VB"></label>RadBinaryImage
<i>aspx</i><br>&lt;RadBinaryImage ID="ImgLogo" runat="server" style="height:auto;width:50% !important;margin:auto;" /&gt;
<br><br><i>vb</i>
If System.IO.File.Exists("PATH") Then
	Dim Img As System.Drawing.Image = System.Drawing.Image.FromFile("PATH")
	Dim ImgConv As New System.Drawing.ImageConverter()

	ImgLogo.DataValue = ImgConv.ConvertTo(Img, GetType(Byte()))
	ImgLogo.DataBind()
End If
ITEM <label class="argomento VB"></label>Gestione Apri/Chiudi filtri

1)  &lt;asp:LinkButton ID="btnApriFiltri" runat="server" OnClientClick="ApriFiltri(); return false;"&gt;&lt;/asp:LinkButton&gt;
    &lt;asp:TextBox ID="hidStatoFiltri" runat="server" style="display: none"&gt;&lt;/asp:TextBox&gt;
    &lt;div id="divFiltri" runat="server" class="row well divFiltri"&gt;
	....
	&lt;/div&gt;
2)  function ApriFiltri() {
            $("#ctl00_corpo_divFiltri").toggle("fast", function () {
                if ($('#ctl00_corpo_divFiltri').is(":hidden")) {
                    $('#ctl00_corpo_btnApriFiltri').html('Filtri &lt;span class="glyphicon glyphicon-menu-down"&gt;&lt;/span&gt;');
                    $('#ctl00_corpo_hidStatoFiltri').val('0');
                } else {                                       
                    $('#ctl00_corpo_btnApriFiltri').html('Filtri &lt;span class="glyphicon glyphicon-menu-up"&gt;&lt;/span&gt;');
                    $('#ctl00_corpo_hidStatoFiltri').val('1');
                }
            });
        }
3) Nella Load

	If Not IsPostBack Then hidStatoFiltri.Text = "0"
	If hidStatoFiltri.Text = "0" Then
		btnApriFiltri.Text = "Filtri &lt;span class=""glyphicon glyphicon-menu-down""&gt;&lt;/span&gt;"
		divFiltri.Style.Clear()
		divFiltri.Style.Add("display", "none")
	Else
		btnApriFiltri.Text = "Filtri &lt;span class=""glyphicon glyphicon-menu-up""&gt;&lt;/span&gt;"
		divFiltri.Style.Clear()
		divFiltri.Style.Add("display", "block")
	End If
	divFiltri.Style.Add("margin-bottom", "0")
 
ITEM <label class="argomento VB"></label>Callback after __doPostBack()

https://stackoverflow.com/questions/7615691/callback-after-dopostback

Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(BeginRequestHandler);
Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
function BeginRequestHandler(sender, args)
{
    //
}
function EndRequestHandler(sender, args)
{
    //request is done
}
ITEM <label class="argomento VB"></label>In una browse per lanciare una funziona js al click (f5) sulla riga basta nell'evento F5 
mettere la chiamata con telerik....e poi keypress = 0 (cfr Parametri Master trasp)
ITEM <label class="argomento VB"></label>Creare menu a discesa in cascata:
1)creo le rbowin delle DropDownList racchiudendo tra dollari l'ID del controllo di cui devo leggere il valore per cui filtrare<br>	
	SELECT '' AS Anno 
	UNION ALL
	SELECT DISTINCT(Anno) FROM tnk_MovimentiTest
	WHERE Tipo = '$cmbTipo$'
	
2) Nell'aspx:
	&lt;asp:UpdatePanel ID="upKey" runat="server" class="col-xs-9"&gt;
		&lt;ContentTemplate&gt;
			&lt;div class="row"&gt;
				&lt;div class="col-xs-12 col-sm-6 col-md-4"&gt;
					&lt;small&gt;Tipo &lt;/small&gt;&lt;br /&gt;
					&lt;cbo:DropDownList ID="cmbTipo" runat="server" IsKey="false" Width="100%" TypeControl="ComboBox" TypeData="Text" CssClass="form-control" DataTextField="Tipo" DataValueField="Tipo" onchange="ChangeTipo()"&gt;&lt;/cbo:DropDownList&gt;  
				&lt;/div&gt;
				&lt;div class="col-xs-12 col-sm-6 col-md-4"&gt;
					&lt;small&gt;Anno &lt;/small&gt;&lt;br /&gt;
					&lt;cbo:DropDownList ID="cmbAnno" runat="server" IsKey="false" Width="100%" TypeControl="ComboBox" TypeData="Text" CssClass="form-control" DataTextField="Anno" DataValueField="Anno" onchange="ChangeAnno()"&gt;&lt;/cbo:DropDownList&gt;  
				&lt;/div&gt;
				&lt;div class="col-xs-12 col-sm-6 col-md-4"&gt;
					&lt;small&gt;Numero &lt;/small&gt;&lt;br /&gt;
					&lt;cbo:DropDownList ID="cmbNumero" runat="server" IsKey="false" Width="100%" TypeControl="ComboBox" TypeData="Text" CssClass="form-control" DataTextField="Numero" DataValueField="Numero" &gt;&lt;/cbo:DropDownList&gt;  
				&lt;/div&gt;                    
			&lt;/div&gt; 

			&lt;%--btn per la gestione  dei cmb--%&gt;
			&lt;asp:LinkButton ID="btnUpdateTipo" runat="server" Text="Update Tipo" style="display:none" /&gt;  
			&lt;asp:LinkButton ID="btnUpdateAnno" runat="server" Text="Update Anno" style="display:none" /&gt; 
		&lt;/ContentTemplate&gt;
	&lt;/asp:UpdatePanel&gt;	
	
3) Nel javascript:
		function ChangeTipo() {
			javascript: __doPostBack('ctl00$corpo$btnUpdateTipo', '');
		}
		function ChangeAnno() {
			javascript: __doPostBack('ctl00$corpo$btnUpdateAnno', '');
		}	

3) Nel vb:
	
    Private Sub pPopolaFiltri()
        cmbTipo.Enabled = True
        cmbAnno.Enabled = True
        cmbNumero.Enabled = True

        cmbTipo.SelectedValue = m_FiltroTipo
        If m_FiltroTipo &lt;&gt; "" Then
            cmbAnno.AggiornaDataSource()
            'prima di assegnare un valore verifico sia incluso nella source del cmb
            If cmbAnno.Items.FindByValue(m_FiltroAnno) IsNot Nothing Then
                cmbAnno.Text = m_FiltroAnno
            Else
                cmbAnno.Text = ""
                m_FiltroAnno = ""
                m_FiltroNumero = "0"
            End If

            If cmbAnno.Text &lt;&gt; "" Then
                cmbNumero.AggiornaDataSource()
                If cmbNumero.Items.FindByValue(m_FiltroNumero) IsNot Nothing Then
                    cmbNumero.Text = m_FiltroNumero
                Else
                    cmbNumero.Text = "0"
                    m_FiltroNumero = "0"
                End If
            Else
                cmbNumero.Enabled = False
            End If
        Else
            cmbAnno.Enabled = False
            cmbNumero.Enabled = False
        End If
    End Sub
	
	e chiamo la pPopolaFiltri nel PreRender
	
	Private Sub btnUpdateTipo_Click(sender As Object, e As EventArgs) Handles btnUpdateTipo.Click
        'SalvaFiltri() 'non serve, non uso le properyt nella pPopolaFiltri....
        cmbAnno.SelectedValue = ""
        cmbAnno.AggiornaDataSource()
    End Sub

    Private Sub btnUpdateAnno_Click(sender As Object, e As EventArgs) Handles btnUpdateAnno.Click
        'SalvaFiltri() 'non serve, non uso le properyt nella pPopolaFiltri....
        cmbNumero.SelectedValue = "0"
        cmbNumero.AggiornaDataSource()
    End Sub
ITEM <label class="argomento VB"></label>In un servizio Windows per gestire un parametro di avvio
Nell'OnStart:
	If My.Application.CommandLineArgs.Count <> 1 Then
		'Registro evento parametro avvio mancante
		Me.Stop()
	End If

	m_ParametroAvvio = My.Application.CommandLineArgs(0)
ITEM <label class="argomento VB"></label>cWinDef regione base
    '#Region "PAGINA"
    '    Private Sub PAGINA__grdGriglia__1(ByRef CboObject As Object)
    '        m_GrigliaWeb.AllowPaging = True
    '        m_GrigliaWeb.PageSize = 20
    '    End Sub
    '
    '    Private Sub PAGINA__grdGriglia__1__Righe(ByRef item As Telerik.Web.UI.GridDataItem, ByRef CboObject As Object)

    '    End Sub
    '#End Region
ITEM <label class="argomento VB"></label>        ''' <summary>
    ''' Funzione che conta quanti a capo ci sono
    ''' </summary>
    ''' <param name="sStringa"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Private Function pCountACapi(ByVal sStringa As String) As Integer
        Dim iRet As Integer
        iRet = System.Text.RegularExpressions.Regex.Matches(sStringa, "\n").Count() + 1 'conto anche l'a capo di fine stringa
        Return iRet
    End Function
ITEM <label class="argomento SQL"></label>Esempio while in SQL:
  /*creo una tabella temporanea globale*/
	DROP TABLE ##codart_2022
	CREATE TABLE ##codart_2022 (
		CodArt VARCHAR(20),
		Cursore numeric(9,0)
	)
	INSERT INTO ##codart_2022
		SELECT CodArt, ROW_NUMBER() OVER(ORDER BY CodArt ASC) AS Cursore
		FROM INVATNEW.dbo.mas_Articoli
		WHERE Descrizione like '%sup%2022%' ---todo sono 83 righe 
	-------------------------------
	DECLARE @CodArt as varchar(20)
	DECLARE @MyCursor numeric(9,0)
	DECLARE @MAXCursor numeric(9,0)
	SET @MyCursor = 1
	SET @MAXCursor = (SELECT COUNT(*) FROM ##codart_2022)

	WHILE @MyCursor <= @MAXCursor
		BEGIN       /*fondamentale, senza non funziona */
			SET @CodArt = (SELECT CodArt FROM ##codart_2022 WHERE Cursore = @MyCursor)
			PRINT('===' + @CodArt + ' =====') 
			DELETE  FROM inv_TabControlliArticoli WHERE CodArticolo = @CodArt
			INSERT INTO inv_TabControlliArticoli
			(CodArticolo, CodControllo, Ordine, ProgPerTurno)
			---0
					  SELECT @CodArt AS CodArticolo, 'PASSA' AS CodControllo, 1 AS Ordine, 0 AS ProgPerTurno
			UNION ALL SELECT @CodArt AS CodArticolo, 'PESO' AS CodControllo, 2 AS Ordine, 0 AS ProgPerTurno
			UNION ALL SELECT @CodArt AS CodArticolo, 'VISIVO' AS CodControllo, 3 AS Ordine, 0 AS ProgPerTurno
			--1
			UNION ALL SELECT @CodArt AS CodArticolo, 'VISIVO' AS CodControllo, 1 AS Ordine, 1 AS ProgPerTurno
			
			SET @MyCursor = @MyCursor + 1	  
	END 

	DROP TABLE ##codart_2022
ITEM <label class="argomento VB"></label> use INVATNEW_MasterLift
update pre_RepTur SET Giorno = '2023-07-26' /*OGGI*/
WHERE IdRepTur = 5831
ITEM <label class="argomento VB"></label>Genoatank piazzale
/*query pulizia*/
  delete from tnk_LayoutMov  
  delete from tnk_LayoutStato
UPDATE tnk_MovimentiTest
SET Park_Area='',Park_Riga='',Park_Colonna='',Park_Altezza='',
Park_Tipologia='',Park_TargaSemiRimorchio='',CodPark_Area= 0

/*query ricerca*/
  select * from tnk_LayoutMov  
  select * from tnk_LayoutStato
  select [Park_Area],[Park_Riga],[Park_Colonna], IdP
      ,[Park_Altezza],[Park_Tipologia]
      ,[Park_TargaSemiRimorchio]
      ,[CodPark_Area], *
	  from tnk_MovimentiTest
   where Park_Altezza <>''
ITEM <label class="argomento VB"></label>Esempio di funzione SQL ed uso del Cursore.
I parametri @CodArt_Evidenzia_1 Varchar(20) = '' sono opzionali 

USE [ARDES_Produzione]
GO
/****** Object:  UserDefinedFunction [dbo].[GetComponentiDBaseConcatenati]    Script Date: 04/09/2023 15:36:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER FUNCTION  [dbo].[GetComponentiDBaseConcatenati](@CodArt Varchar(20), 
						@CodArt_Evidenzia_1 Varchar(20) = '', @CodArt_Evidenzia_2 Varchar(20) = '', @CodArt_Evidenzia_3 Varchar(20) = '',
						@CodArt_Evidenzia_4 Varchar(20) = '', @CodArt_Evidenzia_5 Varchar(20) = '')
	RETURNS VARCHAR(MAX)
	BEGIN
	DECLARE @ConcatenatedValues NVARCHAR(MAX) = '';
	DECLARE @CurrentValue NVARCHAR(MAX);

	/*il cursor da errore se la tabella ha 0 righe, e nelle SQL Function non si possono usare i blocchi Try...Catch,
	pertanto faccio un controllo prima di aprire il cursore: */
	DECLARE @RowCount INT;

	SELECT @RowCount = (	SELECT COUNT(*)
		 FROM ARDES.dbo.mas_DBase
		 WHERE CodArt = @CodArt
		 AND Riga > 0 /*escludo la riga con l'articolo stesso*/
		 AND ISNULL(CodDbase, '') <> '')
	
	IF @RowCount = 0
		RETURN ''

	DECLARE table_cursor CURSOR FOR
		SELECT 
			CASE WHEN CodDbase = @CodArt_Evidenzia_1 OR CodDbase = @CodArt_Evidenzia_2 OR
				CodDbase = @CodArt_Evidenzia_3 OR CodDbase = @CodArt_Evidenzia_4 OR CodDbase = @CodArt_Evidenzia_5
			THEN 
				'<b class="evidenziato">'+CodDbase+'</b>'+'&nbsp;&nbsp;&nbsp;&nbsp;'+ UM + '&nbsp;' + CAST(Qta AS varchar(10))
			ELSE				
				'<b>'+CodDbase+'</b>'+'&nbsp;&nbsp;&nbsp;&nbsp;'+ UM + '&nbsp;' + CAST(Qta AS varchar(10))
			END 
		FROM ARDES.dbo.mas_DBase
		WHERE CodArt = @CodArt
		AND Riga > 0 /*escludo la riga con l'articolo stesso*/
		AND ISNULL(CodDbase, '') <> ''

		OPEN table_cursor;

		FETCH NEXT FROM table_cursor INTO @CurrentValue;

		WHILE @@FETCH_STATUS = 0
		BEGIN
			SET @ConcatenatedValues = @ConcatenatedValues + @CurrentValue + '#####';
			FETCH NEXT FROM table_cursor INTO @CurrentValue;
		END

		SET @ConcatenatedValues = LEFT(@ConcatenatedValues, LEN(@ConcatenatedValues) - 5);
    
		CLOSE table_cursor;
		DEALLOCATE table_cursor;
 
	RETURN  @ConcatenatedValues
 END
ITEM <label class="argomento VB"></label>SU Master la colonna FTipo è il tipo riga:
A = Anagrafica, L = libero, D = Descrittiva
ITEM <label class="argomento VB"></label>Installare Master
<li> Andare su serverAdnCDMasternSetupMaster e prendere gli eseguibili
per Server e Client del 2013
<li> Su MasterHR ! Versionni Master veriicare se il cliente ha già una versione
Master installata e nel caso quale. Copiarsi in locale gli eseguibili
di questa versione.
<li> Lancio prima il setup per Server del 2013
<li> va bene installare in italiano, non ha importanza se la lingua del server
è inglese
<li> installazione tipica
<li> installo il ParserMSXML (installazione tipica, nome utente = utente)
<li> installo anche le DLL esterne ed ignoro l'errore che da sempre dopo
<li> Setup in Apps Install
<li>lancio l'update server
<li> apro la cartella con l'eseguibile e coniguro Master.UDL facendolo puntare
al database TTW
<li> coniguro TTW in modo che punti al corretto database
<li> lancio l'eseguibile per vedere si apra correttamente
<li> Installo i lCliente e l'aggiornamento
<li> Coniguro anche per il client il ile Master.UDL
<li> restore di un backup e prove funzionamento
OSS: su Leostation/Materialeleonardo/ArchiviClientiMaster trovo i backup
del cliente
ITEM <label class="argomento VB"></label>Query personalizzate:
1) devo creare la nuova sigla "abc" (da cboUtility) [crea la tabella abc_RBO_WIN]
2) se la sigla dell'rboWin che voglio sostituire è "xyz", nel campo Form devo scrivere xyz:~/Viaggi_B.aspx
<img class='ImgAppunti' loading='lazy' style='width: auto;' src='Immagini\\imgCboUtility.png'/>
ITEM <label class="argomento VB"></label>
ITEM <label class="argomento VB"></label>
ITEM <label class="argomento VB"></label>
ITEM <label class="argomento VB"></label>
ITEM <label class="argomento VB"></label>
ITEM <label class="argomento VB"></label>
`
/*
ITEM <label class="argomento VB"></label> 
<a href=' ' class='Link'> </a>
<img class='ImgAppunti' loading='lazy' src='Immagini\\img1.png'/>
*/

/*

<button class='btn btn-info btnCopia' onclick='CopiaDaDiv("q1")'>copia</button>
<div class='col-xs-12' id='q1'>
DBCC FREEPROCCACHE
</div><br>

*/







