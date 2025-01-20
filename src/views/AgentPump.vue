<template>
  <div class="home">
    <div class="content-wrapper">
      <div class="header-section">
        <h1>Popular AI Agents</h1>
        <button class="create-button" @click="accStore.ethConnectState == EthWalletState.Connected ? $router.push('/launch') : showChoseWallet = true">
          Create New AI Agent
        </button>
      </div>
      <div class="token-grid">
        <div class="token-card" v-for="(token, index) in tokens" :key="index">
          <router-link :to="'/token/' + token.contract" class="token-link">
            <div class="token-image">
              <img :src="token.image ? token.image : 'https://iaon.lifejiajia.com/agentimages/human.jpg' " :alt="token.name" />
            </div>
            <div class="token-info">
              <h3>{{ token.name }}</h3>
              <p class="description">{{ token.description }}</p>
              <div class="stats">
                <div class="stat">
                  <span class="label">Price</span>
                  <span class="value">{{ token.price ?? '0' }}</span>
                  <span v-if="token.percentage" :class="['change', token.percentage >= 0 ? 'positive' : 'negative']">
                    {{ token.percentage }}%
                  </span>
                </div>
                <div class="stat">
                  <span class="label">Market Cap</span>
                  <span class="value">{{ token.price * 1000000000 }} ETH</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="showChoseWallet"
        modal-class="overlay-white"
        class="max-w-[400px] rounded-[20px]"
        width="50%" :show-close="false" align-center destroy-on-close>
      <ChoseWallet @chosedWallet="showChoseWallet=false"/>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { TokenService } from '../services/tokenService';
import ChoseWallet from '@/components/ChoseWallet.vue'
import { useAccountStore, EthWalletState } from '@/stores/web3'
import { useRouter } from 'vue-router';

const accStore = useAccountStore();
const showChoseWallet = ref(false);
const tokens = ref([]);
const $router = useRouter();

onMounted(async () => {
  const promises = [];
  const tokenList = await TokenService.getTokenList();
  tokens.value = tokenList.data;
  for (let token of tokenList.data) {
    promises.push(tokenDigest24h(token.contract));
  }
  const responses = await Promise.all(promises);
  responses.forEach((response, index) => {
    tokens.value[index].percentage = parseFloat(response.percentage).toFixed(2);
    tokens.value[index].price = response.price;
  });
});

async function tokenDigest24h(contract) {
  try {
    const response = await TokenService.getDigest24h(contract);
    return response.data;
  } catch (error) {
    console.error('Failed to add agent id:', error);
    throw error;
  }
}
</script>

<style lang="scss" scoped>
.home {
  color: #fff;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 80px 0 40px;

      h1 {
        font-size: 2.5rem;
        color: #fff;
        margin: 0;
      }


      .create-button {
        background: linear-gradient(45deg, #6366f1, #a855f7);
        color: #FFFFFF;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &:hover {
          opacity: 0.9;
        }
      }
    }

    .token-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;

      .token-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        .token-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .token-image {
          width: 100%;
          height: 200px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .token-info {
          padding: 20px;

          h3 {
            margin: 0 0 10px 0;
            font-size: 1.2rem;
            color: #fff;
          }

          .description {
            color: #b0b0b0;
            font-size: 0.9rem;
            margin-bottom: 15px;
            line-height: 1.4;
          }

          .stats {
            display: flex;
            justify-content: space-between;

            .stat {
              display: flex;
              flex-direction: column;

              .label {
                font-size: 0.8rem;
                color: #8a8a8a;
                margin-bottom: 5px;
              }

              .value {
                font-size: 1rem;
                color: #fff;
                font-weight: 500;
              }

              .change {
                font-size: 0.9rem;
                font-weight: 500;

                &.positive {
                  color: #00c853;
                }

                &.negative {
                  color: #ff3d00;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
