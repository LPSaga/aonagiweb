<script setup lang="ts">
import {computed, onActivated, onMounted, defineProps, provide, ref, watch, reactive} from "vue";
import { EthWalletState, useAccountStore } from "@/stores/web3";
import { getBuyAmountWithETHAfterFee, getReceivedAmountSellETHAfterFee,
  buyToken, sellToken, getUserTokenInfo,
  getBuyAmountUseEth, getSellAmountUseToken
 } from '@/tools/aon'
import debounce from 'lodash.debounce';
import { formatAmount } from "@/tools/helper";
import { ethers } from "ethers";
import type { TokenHoldingList, UserTokenInfo } from '@/types'

const accStore = useAccountStore()
const tradeType = ref('buy')
const tokenInfo = ref()
const trading = ref(false)
const showFillInfo = ref(false)

const payEth = ref()
const sellAmount = ref()

const receiveAmount = ref()
const receiveEth = ref()

const maxSlippage = ref(5)
const tokenBalance = ref(0)
const ethBalance = ref(0)

const props = defineProps<{token: TokenHoldingList}>()
const token = reactive<UserTokenInfo>({
  contract: '',
  supply: 0n,
  balance: 0,
  ethBalance: 0,
  listed: false
})

watch(payEth, (val) => {
  updateBuyAmount(val)
})

watch(sellAmount, (val) => {
  updateSellAmount(val)
})

const updateBuyAmount = debounce(async (val: any) => {
  if (!val) return;
  showFillInfo.value = false
  const amount = ethers.parseEther(val.toString())

 try {
  if (token.listed) {
    const receive = await getBuyAmountUseEth(token.contract, amount)
    receiveAmount.value = receive
  }else {
   const receive = await getBuyAmountWithETHAfterFee(token.supply, amount)
   receiveAmount.value = receive
  }
 } catch (error) {
    console.log(33, error)
    receiveAmount.value = '0.00'
 }
}, 500)

const updateSellAmount = debounce(async (val: any) => {
  try {
    if (!val) return;
    showFillInfo.value = false
    const amount = ethers.parseEther(val.toString())
    if (token.listed) {
      const receive = await getSellAmountUseToken(token.contract, amount)
      receiveEth.value = receive
    }else {
      const receive = await getReceivedAmountSellETHAfterFee(token.supply, amount)
      receiveEth.value = receive
    }
  } catch (error) {
    receiveEth.value = '0.00'
  }
}, 500)

async function confirm() {
  if (tradeType.value === 'buy') {
    if (!payEth.value) {
      showFillInfo.value = true
      return
    }
    // check eth balance
    if (ethBalance.value < payEth.value) {
      // notify({message: 'Insufficient ETH balance'})
      return
    }
  }else {
    if (!sellAmount.value) {
      showFillInfo.value = true
      return
    };
    // check token balance
    if (tokenBalance.value < sellAmount.value) {
      // notify({message: 'Insufficient token balance'})
      return
    }
  }

  try{
    trading.value = true
    if (!token) return;
    if (tradeType.value === 'buy') {
      if (!payEth.value) return
      const hash = await buyToken(token!.contract, receiveAmount.value, BigInt(payEth.value * 1e18), Math.ceil(maxSlippage.value * 100), token.listed);
      if (hash) {
        payEth.value = undefined
        receiveAmount.value = undefined
        updateUserTokenInfo()
      }else{

      }
    }else {
      if (!sellAmount.value) return;
      const hash = await sellToken(token!.contract, BigInt(sellAmount.value * 1e18), receiveEth.value, Math.ceil(maxSlippage.value * 100), token.listed)
      if (hash) {
        sellAmount.value = undefined
        receiveEth.value = undefined
        updateUserTokenInfo()
      }else {

      }
    }
  } catch (e) {
    console.log(e)
  } finally {
    trading.value = false
  }
}

async function updateUserTokenInfo () {
  try {
    if (ethers.isAddress(accStore.ethconnectAddress)) {
      let info = await getUserTokenInfo(props.token.contract, accStore.ethconnectAddress);

      token.contract = props.token.contract;
      token.supply = info.supply;
      token.balance = info.balance;
      token.ethBalance = info.ethBalance;
      token.listed = info.listed;
      console.log('info', info)
      tokenBalance.value = info.balance;
      ethBalance.value = info.ethBalance;
    }
  } catch (error) {
    console.error('get users token info fail', error)
  }
}

onMounted(async () => {
  updateUserTokenInfo()
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      class="flex-1 overflow-auto flex gap-2"
    >
      <div class="bg-white py-3 web:py-5 px-4 rounded-2xl flex flex-col gap-2 web:gap-3 w-full web:w-[340px]">
        <div
          class="flex rounded-full overflow-hidden h-9 text-white bg-grey-light-active text-h5"
        >
          <button
            class="h-full flex-1"
            :class="tradeType === 'buy' ? 'bg-gradient-primary' : ''"
            @click="tradeType = 'buy'"
          >
            Buy
          </button>
          <button
            class="h-full flex-1"
            :class="tradeType === 'sell' ? 'bg-gradient-primary' : ''"
            @click="tradeType = 'sell'"
          >
            Sell
          </button>
        </div>
        <template v-if="tradeType === 'buy'">
          <div
            class="border-[1px] border-grey-c9 rounded-xl px-4 h-9 web:h-11 gap-4 text-black flex items-center"
          >
            <span class="text-h5">Pay</span>
            <input
              v-model="payEth"
              type="number"
              class="bg-transparent h-full flex-1 w-[120px] text-h3"
            />
            <span class="text-h5 whitespace-nowrap">$ ETH</span>
          </div>
          <div class="text-right text-sm">
            Balance: {{ formatAmount(ethBalance) }}
          </div>
          <div
            class="border-[1px] border-grey-c9 rounded-xl px-4 h-9 web:h-11 gap-4 text-black flex items-center justify-between"
          >
            <span class="text-h5"
              >Receive ${{ props.token.ticker }}</span
            >
            <span class="text-h3">{{ formatAmount(receiveAmount?.toString() / 1e18) }}</span>
          </div>
        </template>
        <template v-else>
          <div
            class="border-[1px] border-grey-c9 rounded-xl px-4 h-9 web:h-11 gap-4 text-black flex items-center"
          >
            <span class="text-h5">Sell</span>
            <input
              v-model="sellAmount"
              type="number"
              class="bg-transparent h-full flex-1 w-[120px] text-h3"
            />
            <span class="text-h5 whitespace-nowrap min-w">$ {{ props.token.ticker }}</span>
          </div>
          <div class="text-sm flex justify-end">
            Balance: {{ formatAmount(tokenBalance) }}
          </div>
          <div
            class="border-[1px] border-grey-c9 rounded-xl px-4 h-9 web:h-11 gap-4 text-black flex items-center justify-between"
          >
            <span class="text-h5">Receive $ETH</span>
            <span class="text-h3">{{ formatAmount(receiveEth?.toString() / 1e18) }}</span>
          </div></template
        >
        <div class="flex items-center justify-between">
          <div class="font-light text-base">设置最大滑点</div>
          <div class="w-[100px] flex items-center justify-between border-[1px] border-grey-light-active rounded-lg h-6 web:h-9 px-3">
            <div class="flex-1 flex items-center gpa-1 h-full">
              <input class="w-12 h-full overflow-hidden text-right text-orange-normal" type="number" v-model="maxSlippage">
              <span class="text-orange-normal">%</span>
            </div>
            <div class="flex flex-col gap-1 ml-4">
              <button @click="maxSlippage+=1">
                <img class="w-2" src="~@/assets/icons/icon-input-add.svg" alt="">
              </button>
              <button :disabled="maxSlippage<=0" @click="maxSlippage-=1">
                <img class="w-2 transform rotate-180" src="~@/assets/icons/icon-input-add.svg" alt="">
              </button>
            </div>
          </div>
        </div>
        <button
          class="w-full h-10 web:h-12 rounded-full bg-gradient-primary text-white text-h5 flex items-center justify-center gap-2"
          @click="confirm"
          :disabled="trading"
        >
          <span>Confirm</span>
        </button>
        <div v-if="showFillInfo" class="text-sm text-red-e6 text-center">
          Please complete the amount
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
