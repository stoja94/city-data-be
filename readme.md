## Requisiti
Prima di iniziare, assicurati di avere i seguenti strumenti installati e configurati:

1. **Node.js**
   - Verifica che Node.js sia installato eseguendo il comando:
     ```bash
     node -v
     ```
2. **MySQL**
   - Verifica che MySQL sia installato e in esecuzione eseguendo il comando:
     ```bash
     mysql -V
     ```
## Configurazione

1. **Modifica i valori nel file `db.js`**
   - Apri il file `db.js` nella directory del progetto.
   - Modifica i valori di configurazione per il database MySQL (host, user, password, database) in base alla tua configurazione locale.

   Esempio:
   ```javascript
   const dbConfig = {
     host: 'localhost',
     user: 'your_username',
     password: 'your_password'
   };

## Installazione

1. **Installa dipendenze**
    ```bash
   npm install
    ```
2. **Avvia il server**
    ```bash
   npm start
   ```

I dati visualizzati su questo sito sono forniti a scopo dimostrativo e di test. Essi non sono di proprietà dell'autore, ma sono utilizzati a fini illustrativi e non commerciali. Nel caso si desideri accedere ai dati completi, si prega di visitare il sito ufficiale: geoportale.cartografia.agenziaentrate.gov.it, dove è possibile trovare tutte le informazioni pertinenti.

Questo README fornisce istruzioni chiare su come verificare le installazioni di Node.js e MySQL, come configurare il file `db.js`, come installare le dipendenze e come avviare il server.