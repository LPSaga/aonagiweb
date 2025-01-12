<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { initPlugin, getBalance } from '@/tools/wallets'
import ChoseWallet from '@/components/ChoseWallet.vue'
import CreateCoin from '@/components/CreateCoin.vue'
import TokenList from '@/components/TokenList.vue'
import { useAccountStore, EthWalletState } from '@/stores/web3'

defineProps<{ msg: string }>()

const showChoseWallet = ref(false)
const showCreateToken = ref(false)
const showTokenList = ref(false)
const accStore = useAccountStore();

async function connect() {
  showChoseWallet.value = !showChoseWallet.value;
}

onMounted(async () => {
  initPlugin();
})
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="connect">
      {{ accStore.ethConnectState == EthWalletState.Connected ? accStore.ethconnectAddress : 'Connect' }}
    </button>
  </div>

  <!-- <div v-if="accStore.ethConnectState == EthWalletState.Connected" class="card"> -->
    <button type="button" @click="getBalance(accStore.ethconnectAddress)">
      Click to update balance: {{ accStore.ethBalance }} ETH
    </button>
  <!-- </div> -->

  <!-- <div v-if="accStore.ethConnectState == EthWalletState.Connected" class="card"> -->
    <button type="button" @click="showCreateToken = true">
      Create token
    </button>
  <!-- </div> -->

  <!-- <div v-if="accStore.ethConnectState == EthWalletState.Connected" class="card"> -->
    <button type="button" @click="showTokenList = true">
      Token list
    </button>
  <!-- </div> -->

  <el-dialog v-model="showChoseWallet"
        modal-class="overlay-white"
        class="max-w-[500px] rounded-[20px]"
        width="90%" :show-close="false" align-center destroy-on-close>
      <ChoseWallet @chosedWallet="showChoseWallet=false"/>
  </el-dialog>
  
  <el-dialog v-model="showCreateToken"
        modal-class="overlay-white"
        class="max-w-[500px] rounded-[20px]"
        width="90%" :show-close="false" align-center destroy-on-close>
      <CreateCoin @close="showCreateToken=false"/>
  </el-dialog>

  <el-dialog v-model="showTokenList"
        modal-class="overlay-white"
        class="max-w-[900px] rounded-[20px]"
        width="90%" :show-close="true" align-center destroy-on-close>
      <TokenList />
  </el-dialog>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
