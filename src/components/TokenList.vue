<script setup lang="ts">
import { formatAddress, formatAmount } from '@/tools/helper';
import { onMounted, ref } from 'vue';
import { getTokenInfoAndBalance } from '@/tools/aon'
import type { TokenHoldingList } from '@/types'
import BuyAndSellView from '@/components/BuyAndSellView.vue'

const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const showTrading = ref(false);

const holdingList = ref<TokenHoldingList[]>([]);
const selectedToken = ref<TokenHoldingList | null>(null);

function trade(token) {
    selectedToken.value = token
    showTrading.value = true
}

onMounted(async () => {
    refreshing.value = true;
    const tokens = localStorage.getItem('tokens')
    try {
        if (tokens.length > 0) {
            holdingList.value = await getTokenInfoAndBalance(tokens.split(','))
        }
    } catch (error) {
        console.error('update token list fail', error)
    } finally {
        refreshing.value = false;
    }
})
</script>

<template>
    <el-table :data="Object.values(holdingList)" style="width: 100%">
      <el-table-column prop="contract" label="Contract" width="240" />
      <el-table-column prop="name" label="Name" width="100" />
      <el-table-column prop="ticker" label="Ticker" width="100" />
      <el-table-column prop="listed" label="Listed" width="80" />
      <el-table-column label="BC Progress" width="140">
        <template #default="scope">
          {{ (scope.row.supply / 1e18 / 8000000).toFixed(2) }}%
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="Balance" width="120"/>
      <el-table-column label="操作" width="180">
        <template #default="scope">
            <el-button size="small" @click="trade(scope.row)">交易</el-button>
        </template>
        </el-table-column>
    </el-table>

    <el-dialog v-model="showTrading"
        modal-class="overlay-white"
        class="max-w-[400px] rounded-[20px]"
        width="90%" :show-close="true" align-center destroy-on-close>
      <BuyAndSellView :token="selectedToken" />
    </el-dialog>
</template>

<style scoped></style>
