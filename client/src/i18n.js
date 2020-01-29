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
          correctStake: "Successful stake",
          stakingPending: "Request sent, check the transaction status"


        },
        sideMenu: {
          menuTitle: "Staking Machine",
          stakingForm: "Staking Form",
          stakeList: "Stake List",
          referrals: "Referrals Panel",
          machineState: "Machine State",
          machineAvailableAmount: " of token still available",
          loadingMachineState: "Loading machine state",
          crowdsaleEntry: "Crowdsale",
          homeEntry: "Home",
          closeEntry: "Close"

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
          referralTitle: "Referral",
          myReferralLabel: "Your referral address is",
          availableReward: "Available Reward",
          totalAvailavelReward: "Total Reward available",
          withdrawAll: "Withdraw All",
          noReferral: "No referral found",
          copyButton: "Copy",
          copyMessage: "Referral code copied into clipboard"
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
            correctStake: "Stake effetuato con successo",
            stakingPending: "Richiesta inviata, controllare lo stato della transazione"

          },
          sideMenu: {
            menuTitle: "Staking Machine",
            stakingForm: "Modulo Staking",
            stakeList: "Lista Stake",
            referrals: "Pannello Referral",
            machineState: "Stato Contratto",
            machineAvailableAmount: " token ancora disponibili",
            loadingMachineState: "Caricando stato macchina",
            crowdsaleEntry: "Crowdsale",
            homeEntry: "Home",
            closeEntry: "Chiudi"

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
            referralTitle: "Referral",
            myReferralLabel: "Il tuo indirizzo di referral è",
            availableReward: "Premio disponibile",
            totalAvailavelReward: "Premio totale",
            withdrawAll: "Preleva premio",
            noReferral: "Nessun referral trovato",
            copyButton: "Copia",
            copyMessage: "Referral copiato negli appunti"
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
    ch: {
      translations: {
        Title: "智能 BITN 合约",
        staking_form: {
          title: "参与",
          subtitle: "在此，把BITN令牌启动智能合约.",
          referralCheckbox: "您有邀请号码?",
          textBoxHelper: "存放数量",
          helpButton: "帮助?",
          referralPlaceholder: "邀请号",
          errorUndefinedStake: "输入令牌数量",
          errorInsufficientFunds: "资金不足",
          errorNoAllowance: "批准未启用",
          unableToStake: "无法抵押",
          correctStake: "成功开启智能合约",
          stakingPending: "请求已发送，请检查交易状态"

        },
        sideMenu: {
          menuTitle: "利息存款",
          stakingForm: "参与",
          stakeList: "权益清单",
          referrals: "推荐面板",
          machineState: "合约状态",
          machineAvailableAmount: "令牌仍然可用",
          loadingMachineState: "装载机状态",
          crowdsaleEntry: "购买",
          homeEntry: "主页",
          closeEntry: "退回主页"
        },
        staking_list: {
          title: "权益清单",
          noStakePresent: "没有合约",
          showArchived: "显示已存档"
        },
        account_info: {
          totalAmount: "股份总额",
          numberOfActiveStake: "活跃合约​​数量",
          noReferralPresent: "推荐"
        },
        referral_panel: {
          referralTitle: "社区推广",
          myReferralLabel: "您的推荐地址是",
          availableReward: "有奖",
          totalAvailavelReward: "总奖金",
          withdrawAll: "提奖金",
          noReferral: "找不到推荐人",
          copyButton: "复制",
          copyMessage: "推荐人已复制到剪贴板"
        },
        stake_detail: {
          previewText: "存入令牌",
          amountStaked: "存入令牌个数",
          periodElasped: "过去的时期",
          penalty: "提款罚款",
          gain: "收益",
          withdrawed: "已退回",
          creationTime: "建立日期",
          availableRewards: "奖金可供收集",
          withdrawReward: "提款",
          withdraw: "撤智能合约"
        },
        withdrawBox: {
          withdrawLabel: "如果您想关掉智能合约，请单击下面的按钮",
          tokenSuccesWithdrawMsg: "提币成功",
          tokenFailedWithdrawMsg: "无法提取令牌",
        },
        help: {
          p1: "智能合约与Ether的管理方式不同。实际上，尽管通常在向智能合约发送ETH时，它能够独立了解它们的来源，但对于ERC20而言并非如此。",
          p2: "因此，在与使用ERC20令牌的智能合约进行交互之前，有必要进行某种“授权”。在实践中，授权智能合约使用指定数量的用户代币.",
          p3: "这使您可以安全地与ERC20令牌进行交易。",
          linkText: "详细内容",
          link: "https://tokenallowance.io/it/index.html"
        },
        crowdsale: {
          title: "销售面板",
          liquidity: "总流动资金", 
          currentRate: "当前汇率",
          amountBITN: "BITN 金额",
          amountETH: "ETH 推买",
          buyButton: "购买",
          snackbarSuccess: "购买 BITN 成功",
          snackbarFailure: "购买时出错",
          liquidityLimitReached: "达到流动性限额"
        },
        approvementPanel: {
          title: "您已确认智能合约",
          approvementStatus: "您已经具有管理权限",
          editExternalButton: "输入数量",
          textLabel: "确认数量",
          editInternalButton: "通过数量批准",
          closeButton: "退回主页"
        },
        HomePage: {
          title: "欢迎",
          subtitle: "马上开启 BITN 利息存款",
          tokenBalance: "钱包里可用令牌",
          stakeToken: "存款令牌!!",
          goStaking: "链接利息存款下一页",
          needToken: "您需要 BITN 令牌代币?",
          goCrowdsale: "购买"
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