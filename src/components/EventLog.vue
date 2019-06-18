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
  <md-table md-card class="md-size-100 event-logs">
    <md-table-toolbar>
      <span class="md-title">Event logs</span>
    </md-table-toolbar>
    <md-table-row style="height:100%;">
      <md-table-head>Log</md-table-head>
    </md-table-row>
    <div v-if="logs.length" class="logs">
      <div v-bind:key="log.message" v-for="log in logs">
        <md-table-row style="height:100%;">
          <md-table-cell class="log" v-bind:class="log.level">{{ log.message }}</md-table-cell>
        </md-table-row>
      </div>
    </div>
    <div v-else>
      <md-table-row>
        <md-table-cell>No logs</md-table-cell>
      </md-table-row>
    </div>
  </md-table>
</template>

<script>
const MAX_LOGS = 5;

export default {
  data() {
    return {
      logs: []
    };
  },
  methods: {
    log(message) {
      if (this.logs.length >= MAX_LOGS) {
        this.logs.shift();
      }
      this.logs.push(message);
    },
    info(message) {
      this.log({ message, level: "info" });
    },
    error(message) {
      this.log({ message, level: "error" });
    },
    removeLog(log) {
      this.logs = this.logs.filter(item => item !== log);
    }
  }
};
</script>
