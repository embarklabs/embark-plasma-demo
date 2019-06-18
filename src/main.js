/*
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
 */

import Vue from "vue";
import App from "./App.vue";
import { MdTable, MdIcon, MdLayout, MdList, MdToolbar, MdCard, MdButton, MdContent, MdTabs } from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import "vue-material/dist/components/MdIcon/index.css";

Vue.use(MdTable);
Vue.use(MdIcon);
Vue.use(MdList);
Vue.use(MdLayout);
Vue.use(MdToolbar);
Vue.use(MdCard);
Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdTabs);

new Vue({
  el: '#app',
  render: h => h(App)
})