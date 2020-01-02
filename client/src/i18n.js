import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      translations: {
        Title: "BITN Staking Machine  ",
        staking_form: {
          title: "Staking Form",
          subtitle: "In this section you could stake your BITN token.",
          referralCheckbox: "Have a referral?",
          textBoxHelper: "Amount to stake",
          helpButton: "Help needed?",
          referralPlaceholder: "Referral Address",
          errorUndefinedStake: "Set the amount to stake first",
          errorInsufficientFunds: "Insufficient funds",
          errorNoAllowance: "Set the allowance first",
          unableToStake: "Unable to stake",
          correctStake: "Successful stake"

        },
        sideMenu: {
          stakingForm: "Staking Form",
          stakeList: "Stake List",
          referrals: "Referrals Panel",
          machineState: "Machine State",
          machineAvailableAmount: " of token still available",
          loadingMachineState: "Loading machine state"

        },
        staking_list: {
          title: "Staking List",
          noStakePresent: "No stake present",
          showArchived: "Show Archived"
        },
        account_info: {
          totalAmount: "Total stake amount",
          numberOfActiveStake: "Number of active stake",
          noReferralPresent: "Referral"
        },
        referral_panel: {
          myReferralLabel: "Your referral address is",
          availableReward: "Available Reward",
          totalAvailavelReward: "Total Reward available",
          withdrawAll: "Withdraw All"
        },
        stake_detail: {
          previewText: "Amount staked",
          amountStaked: "Amount staked",
          periodElasped: "Period elasped",
          penalty: "Withdraw penalty",
          gain: "Gain",
          withdrawed: "Withdrawed",
          creationTime: "Creation Time",
          availableRewards: "Available reward",
          withdrawReward: "Withdraw Rewards",
          withdraw: "Withdraw"
        },
        withdrawBox: {
          withdrawLabel: "Instead if you want to withdraw and terminate you stake, click the button below",
          tokenSuccesWithdrawMsg: "Token successfullu withdrawed",
          tokenFailedWithdrawMsg: "Unable to withdraw tokens",
        },
        help: {
          p1: "Smart contract manages ERC20 tokens differently compared to Ether. In fact if some ERC20 token is sent to the contract, it is not able to understand where these token comes from.",
          p2: "For this reason, you have to set the approvement before each deposit on this app using the related panel",
          p3: "",
          linkText: "More Info",
          link: "https://tokenallowance.io/index.html"
        },
        crowdsale: {
          title: "Crowdsale Panel",
          liquidity: "Total Liquidity", 
          currentRate: "Current exchange rate",
          amountBITN: "Amounf of BITN",
          amountETH: "Amount of ETH",
          buyButton: "Buy",
          snackbarSuccess: "Successful purchase",
          snackbarFailure: "Error on purchase",
          liquidityLimitReached: "Liquidity limit reached"
        },
        approvementPanel: {
          title: "Approvement",
          approvementStatus: "Already has the approvement to manage",
          editExternalButton: "Edit the Amount",
          textLabel: "Amount to approve",
          editInternalButton: "Edit the amount to approve",
          closeButton: "Close"
        },
        HomePage: {
          title: "Welcome",
          subtitle: "Start using your the BITN staking machine now",
          tokenBalance: "Token balance",
          stakeToken: "Stake your token now!!",
          goStaking: "Go to the staking page",
          needToken: "Need some token?",
          goCrowdsale: "Go to the crowdsale page"
        }
      }
    },
    it: {
        translations: {
          Title: "BITN Macchina da Staking",
          staking_form: {
            title: "Modulo Staking",
            subtitle: "In questa sezione potrai fare stake dei tuoi BITN token.",
            referralCheckbox: "Hai un referral?",
            textBoxHelper: "Importo di stake",
            helpButton: "Serve aiuto?",
            referralPlaceholder: "Indirizzo referral",
            errorUndefinedStake: "Inserisci il numero di token",
            errorInsufficientFunds: "Fondi insufficienti",
            errorNoAllowance: "Approvazione non abilitata",
            unableToStake: "Impossibile effettuare lo stake",
            correctStake: "Stake effetuato con successo"

          },
          sideMenu: {
            stakingForm: "Modulo Staking",
            stakeList: "Lista Stake",
            referrals: "Pannello Referral",
            machineState: "Stato Contratto",
            machineAvailableAmount: " token ancora disponibili",
            loadingMachineState: "Caricando stato macchina"
          },
          staking_list: {
            title: "Lista Stake",
            noStakePresent: "Nessuno stake presente",
            showArchived: "Mostra archiviati"
          },
          account_info: {
            totalAmount: "Ammontare totale degli stake",
            numberOfActiveStake: "Numero stake attivi",
            noReferralPresent: "Referral"
          },
          referral_panel: {
            myReferralLabel: "Il tuo indirizzo di referral è",
            availableReward: "Premio disponibile",
            totalAvailavelReward: "Premio totale",
            withdrawAll: "Preleva premio"
          },
          stake_detail: {
            previewText: "Token in stake",
            amountStaked: "Token in stake",
            periodElasped: "Periodi trascorsi",
            penalty: "Penalità al prelievo",
            gain: "Guadagno",
            withdrawed: "Prelevato",
            creationTime: "Data creazione",
            availableRewards: "Premio disponibile al ritiro",
            withdrawReward: "Preleva premio",
            withdraw: "Preleva"
          },
          withdrawBox: {
            withdrawLabel: "Se invece vuoi ritirare lo stake, clicca il bottone qui sotto",
            tokenSuccesWithdrawMsg: "Token prelevati con successo",
            tokenFailedWithdrawMsg: "Impossibile prelevare token",
          },
          help: {
            p1: "Gli smart-contract gestiscono i token ERC20 in maniera diversa dagli Ether. Infatti, mentre normalmente quando si inviano ETH ad uno smart-contract esso è in grado capire autonomamente da chi provengono, per gli ERC20 non è così.",
            p2: "Per questo motivo, prima di interagire con uno smart-contract che utilizza token ERC20, è necessario dare una sorta di \"Autorizzazione\". In pratica si autorizza lo smart-contract ad utilizzare una quantità specificata dei token dell'utente.",
            p3: "In questo modo è possibile effettuare in modo sicuro transazione con i token ERC20.",
            linkText: "Maggiori informazioni",
            link: "https://tokenallowance.io/it/index.html"
          },
          crowdsale: {
            title: "Pannello Vendita",
            liquidity: "Liquidità Totale", 
            currentRate: "Cambio attuale",
            amountBITN: "Ammontare di BITN",
            amountETH: "Ammontare di  ETH",
            buyButton: "Acquista",
            snackbarSuccess: "Token acquistati con successo",
            snackbarFailure: "Errore durante l'acquisto",
            liquidityLimitReached: "Limite di liquidità raggiunto"
          },
          approvementPanel: {
            title: "Autorizzazione",
            approvementStatus: "Hai già l'approvazione per gestire",
            editExternalButton: "Modifica la quantità",
            textLabel: "Quantità da approvare",
            editInternalButton: "Modifica la quantità da approvare",
            closeButton: "Chiudi"
          },
          HomePage: {
            title: "Benvenuto",
            subtitle: "Inizia subito ad usare la BITN Staking Machine",
            tokenBalance: "Token Disponibili",
            stakeToken: "Metti i tuoi token in stake ora!!",
            goStaking: "Vai alla pagina di staking",
            needToken: "Hai bisogno dei BITN token?",
            goCrowdsale: "Vai alla pagina di crowdsale"
          }
        }
      },

  },
  fallbackLng: "en",
  debug: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: ".", // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  }
});

export default i18n;