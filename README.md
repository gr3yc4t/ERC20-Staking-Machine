# ERC20 Staking Machine
Dapp that implements a "fake-stake" mechanism on any ERC20 token. The code is written specifically for a fixed-supply ERC20 token, but it can be easily extended also to ERC20 mintable token.
## How does it work?
Users can simulate the process of staking on any ERC20 token, earning rewards according to the number of periods they left their token into the platform.
Just one level of referral is supported, and the corresponding interest can be customized.
## Features
* "Fake-stake" mechanism with customizable reward
* One level of referral
* Crowdsale page where token can be bought
* Fully responsive
## Installation
The Dapp is build over the Truffle Framework, in particular the initial boilerplate was the ["react" box ](https://www.trufflesuite.com/boxes/react), so all the information regarding the building process can be found on the link.
### Localization
Currently the app only supports English and Italian, but additional languages can be added by editing the file `i18n.js`
### Compatibility
The app was tested with the following browser
- Deskop
  - Brave Browser
- Mobile
  - imToken
  - Metamask Android (Beta)
