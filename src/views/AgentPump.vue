<template>
  <div class="home">
    <div class="content-wrapper">
      <div class="header-section">
        <h1>Popular AI Agents</h1>
        <router-link to="/launch" class="create-button">Create New AI Agent</router-link>
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
                  <span :class="['change', token.aonFee >= 0 ? 'positive' : 'negative']">
                    {{ token.aonFee >= 0 ? '+' : '' }}{{ token.aonFee }}
                  </span>
                </div>
                <div class="stat">
                  <span class="label">Market Cap</span>
                  <span class="value">${{ token.totalSupply }}</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TokenService } from '../services/tokenService';

export default {
  name: 'Home',
  data() {
    return {
      tokens: []
    };
  },
  created() {
    TokenService.getTokenList()
      .then(tokenList => {
        console.log('token list:', tokenList);
        this.tokens = tokenList.data;
      })
      .catch(error => {
        console.error('Error fetching token list:', error);
      });
  }
};
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
        padding: 12px 24px;
        background: linear-gradient(45deg, #6366f1, #a855f7);
        color: #fff;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.3s;

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
