<!-- 
Copyright 2019 OmiseGO Pte Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. 
 -->
<template>
  <div id="app">
    <div v-if="hasWeb3">
      <md-toolbar class="md-transparent">
        <img class="logo md-image" src="./assets/status_logo.png">
        <img class="logo sink md-image" src="./assets/OmiseGO_Logo.svg">
      </md-toolbar>
      <div class="md-layout md-gutter">
        <md-card class="md-layout-item md-size-25 actions">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">Account</div>
            </md-card-header-text>
          </md-card-header>
          <md-card-content>
            <md-list class="md-double-line">
              <md-list-item>
                <div class="md-list-item-text">
                  <span>
                    <b>Wallet Address:</b>
                  </span>
                  <span>{{ account.address }}</span>
                </div>
              </md-list-item>
              <md-list-item class="md-size-50">
                <div class="md-list-item-text">
                  <span>
                    <b>Rootchain Balance:</b>
                  </span>
                  <span>
                    <span class="balance">{{ account.rootBalance }} wei</span>
                  </span>
                </div>
              </md-list-item>
              <md-list-item class="md-size-50">
                <div class="md-list-item-text">
                  <span>
                    <b>Childchain Balance:</b>
                  </span>
                  <div v-bind:key="balance.currency" v-for="balance in account.childBalances">
                    <span
                      class="balance"
                    >{{ balance.amount }} {{ balance.symbol }} ({{ balance.currency === OmgUtil.transaction.ETH_CURRENCY ? "ETH" : balance.currency}})</span>
                  </div>
                </div>
              </md-list-item>
            </md-list>
          </md-card-content>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">Actions</div>
            </md-card-header-text>
          </md-card-header>
          <md-card-content>
            <div class="md-layout md-alignment-center-center md-gutter">
              <div class="md-layout-item md-xsmall-size-100 md-medium-size-50">
                <md-button class="md-raised" v-on:click="refresh">Refresh</md-button>
              </div>
              <div class="md-layout-item md-xsmall-size-100 md-medium-size-50">
                <md-button v-on:click="toggleDeposit" class="md-raised md-primary">Deposit</md-button>
              </div>
              <div class="md-layout-item md-xsmall-size-100 md-medium-size-50">
                <md-button v-on:click="toggleTransfer" class="md-raised md-primary">Transfer</md-button>
              </div>
              <div class="md-layout-item md-xsmall-size-100 md-medium-size-50">
                <md-button v-on:click="toggleExit" class="md-raised md-primary">Exit</md-button>
              </div>
            </div>
          </md-card-content>
        </md-card>
        <md-table md-card class="md-layout-item md-size-75">
          <md-table-toolbar>
            <span class="md-title">Transaction History</span>
          </md-table-toolbar>
          <div v-if="transactions.length" class="transactions-container">
            <md-table-row>
              <md-table-head class="date">Date</md-table-head>
              <md-table-head class="hash">Tx Hash</md-table-head>
              <md-table-head>Currency / Value</md-table-head>
            </md-table-row>
            <div v-bind:key="transaction.txhash" v-for="transaction in transactions">
              <md-table-row>
                <md-table-cell
                  class="date"
                >{{ new Date(transaction.block.timestamp * 1000).toLocaleString() }}</md-table-cell>
                <md-table-cell class="hash">{{ transaction.txhash }}</md-table-cell>
                <md-table-cell>
                  <div
                    v-bind:key="result.currency + result.value"
                    class="result"
                    v-for="result in transaction.results"
                  >
                    <div class="txhash">
                      <b>Currency:</b>
                      {{ result.currency }}
                    </div>
                    <div class="txhash">
                      <b>Value:</b>
                      {{ result.value }}
                    </div>
                  </div>
                </md-table-cell>
              </md-table-row>
            </div>
          </div>
        </md-table>
      </div>
      <EventLog ref="eventLog"/>

      <Deposit
        v-if="isShowDeposit"
        v-on:close="toggleDeposit()"
        v-bind:OmgUtil="OmgUtil"
        v-bind:rootChain="rootChain"
        v-bind:activeAccount="account"
        v-bind:plasmaContractAddress="plasmaContractAddress"
        v-bind:EmbarkJS="EmbarkJS"
      />

      <Transfer
        v-if="isShowTransfer"
        v-on:close="toggleTransfer()"
        v-bind:OmgUtil="OmgUtil"
        v-bind:childChain="childChain"
        v-bind:rootChain="rootChain"
        v-bind:activeAccount="account"
        v-bind:EmbarkJS="EmbarkJS"
      />

      <Exit
        v-if="isShowExit"
        v-on:close="toggleExit()"
        v-bind:rootChain="rootChain"
        v-bind:childChain="childChain"
        v-bind:activeAccount="account"
        v-bind:utxos="utxos"
        v-bind:EmbarkJS="EmbarkJS"
      />
    </div>
    <div v-else class="load-wallet">
      <h2>Enable MetaMask to continue...</h2>
    </div>
  </div>
</template>

<script>
import EventLog from "./components/EventLog.vue";
import Deposit from "./components/Deposit.vue";
import Transfer from "./components/Transfer.vue";
import Exit from "./components/Exit.vue";
import OmgUtil from "@omisego/omg-js-util";
import EmbarkJS from "./embarkArtifacts/embarkjs";
import web3 from "./embarkArtifacts/modules/web3";
import pify from "pify";

export default {
  name: "app",
  components: {
    EventLog,
    Deposit,
    Transfer,
    Exit
  },
  data() {
    return {
      hasWeb3: false,
      isShowDeposit: false,
      isShowExit: false,
      isShowTransfer: false,
      rootChain: {},
      childChain: {},
      OmgUtil: OmgUtil,
      EmbarkJS: EmbarkJS,
      plasmaContractAddress: "",
      utxos: [],
      transactions: [],
      account: {
        rootBalance: 0,
        childBalances: []
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    info: function(message) {
      console.log(message);
      this.$refs.eventLog.info(message);
    },
    error: function(message) {
      console.error(message);
      this.$refs.eventLog.error(message);
    },
    init: async function() {
      try {
        await pify(EmbarkJS.onReady)();

        await EmbarkJS.Plasma.init(web3);

        this.hasWeb3 =
          EmbarkJS.Plasma.web3 &&
          ((EmbarkJS.Plasma.web3.currentProvider &&
            EmbarkJS.Plasma.web3.currentProvider.isMetaMask) ||
            (EmbarkJS.Plasma.web3.givenProvider &&
              EmbarkJS.Plasma.web3.givenProvider.isMetaMask));

        const {
          rootChain,
          childChain,
          plasmaContractAddress
        } = EmbarkJS.Plasma;
        this.rootChain = rootChain;
        this.childChain = childChain;
        this.plasmaContractAddress = plasmaContractAddress;

        this.refresh();
      } catch (err) {
        this.error(err);
      }
    },

    refresh: async function() {
      await EmbarkJS.Plasma.updateState();
      const { transactions, account, utxos } = EmbarkJS.Plasma.state;

      this.utxos = utxos;
      this.transactions = transactions;
      this.account = account;
    },

    toggleDeposit() {
      this.isShowDeposit = !this.isShowDeposit;
    },
    toggleTransfer() {
      this.isShowTransfer = !this.isShowTransfer;
    },
    toggleExit() {
      this.isShowExit = !this.isShowExit;
    }
  }
};
</script>

<style>
span.balance {
  display: block;
}

img.logo {
  height: 60px;
  margin: 20px 0 20px 20px;
}

img.logo.sink {
  margin-bottom: 0;
}

.md-card-header-text > .md-title {
  font-weight: 900;
}

body {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: black;
}
h2 {
  text-align: center;
  margin: 8px;
}

.childchain-balance-header {
  font-size: 20;
  text-align: center;
  margin-bottom: 8px;
}

.transaction {
  padding: 6px;
}

.txhash {
  display: block;
}

.transaction .txhash {
  font-size: 10pt;
}

.transaction .date {
  font-size: 10pt;
}

.transaction .result {
  display: inline-block;
}

.popup-from-address {
  font-size: 10pt;
  margin-bottom: 10px;
}
.popup-input {
  text-align: right;
  margin-bottom: 10px;
}
.popup-input input {
  width: 200px;
}
.popup-input select {
  width: 200px;
}
.actions button.md-button {
  width: 100%;
}
.md-table {
  height: 100% !important;
}
th.date,
td.date {
  width: 140px;
}
th.hash,
td.hash {
  width: 380px;
  word-break: break-all;
}
.transactions-container {
  max-height: 450px;
}
</style>
