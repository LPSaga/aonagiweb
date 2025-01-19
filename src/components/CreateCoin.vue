<script setup lang="ts">
import { reactive, ref, computed, watch, defineEmits } from "vue";
import { EthWalletState, useAccountStore } from "@/stores/web3";
import { ethers } from "ethers";
import { createCoin, calculateInitEth, checkTickUsed } from "@/tools/aon";
import { formatPrice, formatAmount } from '@/tools/helper'
import ChoseWallet from '@/components/ChoseWallet.vue'

type CreateTicker = {
  name: string,
  ticker: string,
  token: string,
  createHash?: string,
  initAmount?: bigint // this is token amount
  initEth?: bigint // this is eth amount
}
const emits = defineEmits(['close'])

const CreateFee = '0.04'
const createLoading = ref(false);
const showMaxAmount = ref(false);
const showTickUsed = ref(false);
const showInputTicker = ref(false);
const createForm = reactive<CreateTicker> ({
    name: "",
    ticker: "",
    token: "",
})

const accStore = useAccountStore();
const inputName = ref('');
const inputTicker = ref("");

const showingInitAmount = ref<number|undefined>()
const showingInitEth = ref<string|undefined>('$0')

const BondingCurveSupply = ref(800000000)

watch(() => showingInitAmount.value, (val) => {
  if (val && val > 0) {
    if (val > BondingCurveSupply.value) {
      showMaxAmount.value = true
      createForm.initAmount = 0n
      createForm.initEth = 0n
      return;
    }
    showMaxAmount.value = false
    createForm.initAmount = ethers.parseEther(val.toString())
    calculateInitEth(createForm.initAmount).then((amount: any) => {
        createForm.initEth = amount;
        showingInitEth.value = formatPrice((createForm.initEth as any).toString() / 1e18)
    })
    
  }else {
    createForm.initAmount = 0n
    createForm.initEth = 0n
  }
})


const create = async () => {
    console.log('Creating')
  // const account = accStore.getAccountInfo;
  showTickUsed.value = false;
  showInputTicker.value = false;
  if (createForm.ticker.length == 0) {
    showInputTicker.value = true
    return;
  }
  if (await checkTickUsed(createForm.ticker)) {
    showTickUsed.value = true;
    return;
  }
  try {
    createLoading.value = true;

    // create token
    console.log('createForm', createForm)
    const {createHash, token} = await createCoin(createForm);
    if (!token) return;
    createForm.createHash = createHash;
    createForm.token = token;
    // upload community info
    delete createForm.initAmount
    delete createForm.initEth
    let storedToken = localStorage.getItem('tokens');
    storedToken = storedToken ? storedToken + ',' + token : token;
    localStorage.setItem('tokens', storedToken);
    emits('close')
  } catch (e) {
    console.error('create community fail', e)
  } finally {
    createLoading.value = false;
  }
};
</script>

<template>
  <ChoseWallet v-if="accStore.ethConnectState !== EthWalletState.Connected" />
  <div v-else class="flex flex-col gap-y-2">
    <div>
      <div class="flex flex-col gap-4">
      <!-- name -->
        <div class="flex flex-col gap-1">
          <label for="name" class="leading-6 text-lg font-medium text-black">Token(Name):</label>
          <input
            class="border-b-[1px] border-grey-e6 leading-6 text-base"
            v-model="createForm.name"
            type="text"
            id="name"
            placeholder="Input token name"
          />
        </div>
        <!-- ticker -->
        <div class="flex flex-col gap-1">
          <label for="name" class="leading-6 text-lg font-medium text-black">Token(Ticker):</label>
          <input
            class="border-b-[1px] border-grey-e6 leading-6 text-base"
            v-model="createForm.ticker"
            type="text"
            id="ticker"
            placeholder="Input token ticker"
          />
          <div class="text-red-e6 text-sm" v-show="showTickUsed">
            This ticker has been created
          </div>
          <div class="text-red-e6 text-sm" v-show="showInputTicker">
            Please input a ticker
          </div>
        </div>
        <!-- amount -->
        <div class="flex flex-col gap-1">
          <label for="initamount" class="font-medium text-black text-lg">
            Choose how many token you want to buy (optional)
          </label>
          <div class="flex items-center border-b-[1px] border-grey-e6 gap-2">
            <input
                class="flex-1 leading-6 text-base"
                v-model="showingInitAmount"
                type="number"
                id="initamount"
                placeholder="Input amount"
            />
            <span class="italic text-red-e6">Token</span>
          </div>
          <div class="text-red-e6 text-sm" v-show="showMaxAmount">
              The max amount is 800000000
          </div>
          <div class="text-left text-grey-normal">
            Will cost {{ showingInitEth }} ETH to buy token
          </div>
        </div>
      </div>
      <div class="pb-2">
        <button
          class="h-12 w-full bg-gradient-primary text-white font-bold rounded-full text-lg flex items-center justify-center gap-2 disabled:opacity-30"
          @click="create"
          :disabled="createLoading"
        >
          <span>Create</span>
        </button>
        <div class="flex justify-between items-center gap-2 mt-2 text-sm px-3">
          <span class="text-grey-normal">Cost to deploy：</span>
          <span class="text-red-e6 italic">~ {{ CreateFee }} ETH</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
