<script setup lang="ts">
import { getProviders, setActiveProviderDetail, setMetaMaskSDK, closeProvider } from "@/tools/wallets";
import { computed, ref } from "vue";

const loading = ref(false);
const providers = computed(() => {
  return getProviders() ?? [];
});

const emits = defineEmits(['chosedWallet'])

async function onSelectWalletMeta(wallet: any) {
  setActiveProviderDetail(wallet);
  emits('chosedWallet')
}

async function connectMetaMask() {
  setMetaMaskSDK();
  emits('chosedWallet')
}

</script>

<template>
  <div class="wallet-container">
    <h2 class="text-xl font-bold text-black">{{ providers.length > 0 ? 'Chose Wallet' : 'connect wallet' }}</h2>
    <div style="margin: 20px 20px;">
      <!-- <p class="text-base text-gray-500 mb-5">{{ providers.length > 0 ? 'Chose wallet' : 'connect wallet' }} </p> -->
    </div>

    <div class="flex flex-col gap-2 pt-4 pb-6" v-if="providers.length > 0">
      <button
          class="wallet-button"
          v-for="wallet of providers"
          :key="wallet.info.uuid"
          :disabled="loading"
          @click="onSelectWalletMeta(wallet)"
      >
        <img class="w-8 h-8" :src="wallet.info.icon" alt="" />
        <span class="min-w-[100px] ml-3 text-center flex justify-center items-center gap-1 text-lg font-semibold">
          {{ wallet.info.name }}
        </span>
      </button>
    </div>
    <div class="flex flex-col gap-2 pt-4 pb-6" v-else>
      <button
          class="wallet-button"
          :disabled="loading"
          @click="connectMetaMask()"
      >
        <img class="h-full" src="https://docs.metamask.io/img/metamask-logo.svg" alt="" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.wallet-container {
  padding: 20px;
  background-color: #f5f5f5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.wallet-button {
  width: 100%;
  border: 1px solid #ccc;
  margin-top: 10px;
  padding: 10px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.wallet-button:hover {
  border-color: #ff7f50;
  background-color: #ff7f50;
  color: white;
}
</style>