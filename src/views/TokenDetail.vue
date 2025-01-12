<template>
  <div class="token-detail">
    <div class="back-button" @click="$router.go(-1)">
      <span>← Back</span>
    </div>
    
    <div class="token-info">
      <div v-if="tokenDetail" class="token-header">
        <div class="token-image">
          <img :src="tokenDetail.image ? tokenDetail.image : 'https://iaon.lifejiajia.com/agentimages/human.jpg' "  alt="Token Image" />
        </div>
        <div class="token-title">
          <h1 style="background: linear-gradient(45deg, #E8E1F5, #FFFFFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{{ tokenDetail.name }} (${{ tokenDetail.symbol }}) <span class="favorite">☆</span></h1>
          <div class="contract">
            Contract: {{ tokenDetail.contract }}
            <button class="copy-button" @click="copyContract">
              <i class="fas fa-copy"></i>
            </button>
          </div>
          <div class="tags">
            <span v-if="tokenDetail.tags" v-for="tag in tokenDetail.tags.split(',')" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <p class="description" style="color: #E8E1F5;">
            {{ tokenDetail.description }}
          </p>
        </div>
      </div>

      <div class="token-stats">
        <div class="stat-item">
          <div class="label" style="color: #8F85B8;">Price</div>
          <div class="value" style="color: #FFFFFF;">0.000033 TRX</div>
          <div class="change negative">-2.95%</div>
        </div>
        <div class="stat-item">
          <div class="label" style="color: #8F85B8;">Market Cap</div>
          <div class="value" style="color: #FFFFFF;">$10.04k</div>
        </div>
        <div class="stat-item">
          <div class="label" style="color: #8F85B8;">Virtual Liquidity</div>
          <div class="value" style="color: #FFFFFF;">$21.19k</div>
        </div>
        <div class="stat-item">
          <div class="label" style="color: #8F85B8;">24H Volume</div>
          <div class="value" style="color: #FFFFFF;">6,239.73 TRX</div>
        </div>
      </div>

      <div class="trading-section">
        <div class="left-section">
          <div class="chart" style="width: 600px; height: 400px;">
            <h3 style="color: #FFFFFF;">Trading Chart</h3>
            <canvas id="klineChart"></canvas>
          </div>

          <div class="trade-form">
            <div class="trade-tabs">
              <button 
                class="tab" 
                :class="{ active: activeBuyTab === 'buy' }" 
                @click="toggleTab('buy')"
              >
                Buy
              </button>
              <button 
                class="tab" 
                :class="{ active: activeBuyTab === 'sell' }" 
                @click="toggleTab('sell')"
              >
                Sell
              </button>
            </div>
            
            <div class="input-group">
              <input type="number" placeholder="Enter amount" />
              <span class="currency">TRX</span>
            </div>
            
            <div class="quick-amounts">
              <button @click="buyOrSellToken(100)">100 TRX</button>
              <button @click="buyOrSellToken(500)">500 TRX</button>
              <button @click="buyOrSellToken(1000)">1000 TRX</button>
              <button @click="buyOrSellToken(5000)">5000 TRX</button>
            </div>
            
            <button class="connect-wallet" @click="buyOrSellToken(1)"> {{ activeBuyTab === 'buy' ? 'Sell' : 'Buy'}}</button>
          </div>

          <div class="bonding-curve">
            <div class="curve-header">
              <h3 style="color: #FFFFFF;">Bonding Curve Progress: 0.49%</h3>
              <div class="info-tooltip">ⓘ</div>
            </div>
            <div class="curve-info">
              <p>There are <span class="highlight">784,543,856.88 LLAMA</span> still available for sale in the bonding curve and there are <span class="highlight">512.88 TRX</span> in the bonding curve.</p>
              <p>When the market cap reaches $ <span class="highlight">149,206.86</span> all the liquidity from the bonding curve will be deposited into AonSwap and burned. Progression increases as the price goes up.</p>
            </div>
          </div>

          <div class="holder-distribution">
            <h3 style="color: #FFFFFF;">Holder Distribution</h3>
            <div v-if="topHolders.length" class="distribution-list">
              <div v-for="holder in topHolders" :key="holder.id" class="distribution-item">
                <div class="holder">{{ holder.holder }}</div>
                <div class="holder-info">
                  <div class="percentage-text">{{ holder.amount }}%</div>
                  <div class="holder-type">{{ holder.type }}</div>
                </div>
                <div class="percentage-bar">
                  <div class="bar" :style="{ width: holder.amount + '%' }"></div>
                </div>
              </div>
            </div>
            <div v-else>No holder distribution data available.</div>
          </div>
        </div>
        
        <div class="right-section">
          <div class="related-apps">
            <h3 style="color: #FFFFFF;">Related Agents</h3>
            <div class="apps-container">
              <div class="app-item">
                <div class="app-icon">
                  <img src="@/assets/app1.jpg" alt="ChatGPT Pro" />
                </div>
                <div class="app-info">
                  <div class="app-name">ChatGPT Pro</div>
                </div>
              </div>
              <div class="app-item">
                <div class="app-icon">
                  <img src="@/assets/app2.jpg" alt="Midjourney Plus" />
                </div>
                <div class="app-info">
                  <div class="app-name">Midjourney Plus</div>
                </div>
              </div>
              <div class="app-item">
                <div class="app-icon">
                  <img src="@/assets/app3.jpg" alt="Claude Assistant" />
                </div>
                <div class="app-info">
                  <div class="app-name">Claude Assistant</div>
                </div>
              </div>
            </div>
          </div>

          <div class="tabs-container">
            <div class="tabs">
              <button 
                :class="['tab', { active: activeTab === 'comments' }]"
                @click="activeTab = 'comments'"
              >
                Comments
              </button>
              <button 
                :class="['tab', { active: activeTab === 'trading' }]"
                @click="activeTab = 'trading'"
              >
                Trading History
              </button>
              
            </div>

            <div class="tab-content">
              <div v-if="activeTab === 'comments'" class="comments-section">
                <div class="comment-form">
                  <textarea 
                    v-model="newComment" 
                    placeholder="Write a comment..."
                  ></textarea>
                  <button @click="addComment">Post Comment</button>
                </div>
                <div class="comments-list">
                  <div v-for="(comment, index) in comments" :key="index" class="comment-item">
                    <div class="comment-header">
                      <img :src="comment.avatar ? comment.avatar : 'https://iaon.lifejiajia.com/agentimages/meme.jpg' " alt="User Avatar" class="avatar" />
                      <div class="comment-info">
                        <div class="username">{{ comment.username }}</div>
                        <div class="timestamp">{{ comment.timestamp }}</div>
                      </div>
                    </div>
                    <div class="comment-content">{{ comment.content }}</div>
                  </div>
                </div>
              </div>

              <BuyAndSellView :token="contract" />

              <div v-if="activeTab === 'trading'" class="trading-history">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Price (TRX)</th>
                      <th>Amount</th>
                      <th>Total</th>
                      <th>Time</th>
                      <th>From</th>
                    </tr>
                  </thead>
                  <tbody v-if="tradingHistory.length > 0">
                    <tr v-for="(trade, index) in tradingHistory" :key="index">
                      <td :class="['type', trade.type.toLowerCase()]">{{ trade.type }}</td>
                      <td>{{ trade.price }}</td>
                      <td>{{ trade.amount }}</td>
                      <td>{{ trade.total }}</td>
                      <td>{{ trade.time }}</td>
                      <td class="address">{{ trade.from }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="additional-info">
        <!-- Removed -->
      </div>

    </div>

    <el-dialog v-model="showTrading"
        modal-class="overlay-white"
        class="max-w-[400px] rounded-[20px]"
        width="90%" :show-close="true" align-center destroy-on-close>
        <BuyAndSellView :token="userTokenInfo" />
      </el-dialog>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
import { CommentService } from '../services/commentService';
import { TokenService } from '../services/tokenService';
import BuyAndSellView from '@/components/BuyAndSellView.vue'
import { ref, onMounted } from 'vue'

// const showTrading = ref(false);

export default {
  name: 'TokenDetail',
  components: {
    BuyAndSellView,
  },
  data() {
    return {
      activeTab: 'comments',
      newComment: '',
      comments: [],
      tradingHistory: [],
      contract: '',
      topHolders: [],
      tokenDetail: {},
      klineData: [],
      activeBuyTab: 'buy',
      showTrading:false,
      userTokenInfo:{}
    }
  },
  created() {
    this.contract = this.$route.params.id;
    console.log('contract:', this.contract);
  },
  methods: {
    buyOrSellToken(ammount) {
      this.userTokenInfo = {
        contract: this.contract,
        supply: 1,
        balance: 0.00001,
        ethBalance: 0.00002,
        listed: false
      };
      console.log('buyOrSellToken:', this.userTokenInfo);

      this.showTrading = true;
    },
    toggleTab(tab) {
      console.log('activeBuyTab:', tab);
      this.activeBuyTab = tab;
    },
    async fetchComments() {
      try {
        const response = await CommentService.listComments(this.contract);
        console.log('comments:', response);
        if (response.data) {
            this.comments = response.data.map(comment => ({
            username: comment.token,
            avatar: comment.avatar || '', // Assuming avatar is part of the response
            timestamp: comment.createdTime,
            content: comment.content
          }));
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    },
    copyContract() {
      navigator.clipboard.writeText('TBBupmygTph3wKZtqNY5mCRXfvwuY5dT2R3')
    },
    addComment() {
      try {
          CommentService.postComment({
            token: 'AI Agent',
            comment: this.newComment,
            createdBy: '0xb492192a8793ec8c2c00379a6de6c9dac8f3bc91'
          }).then(response => {
            if (response.status === 'success') {
              this.newComment = '';
              this.fetchComments();
            }
          });
        } catch (error) {
          console.error('Failed to add comment:', error);
        }
    },
    async fetchTopHolders() {
      try {
        const response = await TokenService.getTopHolders(this.contract);
        this.topHolders = response.data || [];
        console.log('topHolders:', this.topHolders);
      } catch (error) {
        console.error('Failed to fetch top holders:', error);
        this.topHolders = [];
      }
    },
    async fetchTokenDetail() {
      try {
        const response = await TokenService.getTokenDetail(this.contract);
        this.tokenDetail = response.data || {};
      } catch (error) {
        console.error('Failed to fetch token detail:', error);
        this.tokenDetail = {};
      }
    },
    async fetchKlineData() {
      try {
        const response = await TokenService.getKlineData(this.contract);
        this.klineData = response.data || [];
        console.log('klineData:', this.klineData);
        this.renderKlineChart();
      } catch (error) {
        console.error('Failed to fetch Kline data:', error);
        this.klineData = [];
      }
    },
    renderKlineChart() {
      const ctx = document.getElementById('klineChart').getContext('2d');
       if (!ctx) return
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'API Calls',
          data: this.klineData[0],
          fill: true,
          borderColor: '#10b981',
          fill: true,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 1
        }]
      }

      new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#888',
                callback: function(value) {
                  if (value >= 1000000) return (value/1000000).toFixed(1) + 'M'
                  if (value >= 1000) return (value/1000).toFixed(0) + 'K'
                  return value
                }
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#888'
              }
            }
          }
        }
      })
    },
    async fetchTradingHistory() {
      try {
        const response = await TokenService.getRecentTransactions(this.contract);
        this.tradingHistory = response.data.map(tx => ({
          type: tx.isBuy ? 'Buy' : 'Sell',
          price: (parseFloat(tx.price) / parseFloat(tx.qty)).toFixed(8),
          amount: tx.qty,
          total: tx.quoteQty,
          time: new Date(tx.time).toLocaleString(),
          from: tx.trader
        }));
        console.log('trading history:', this.tradingHistory);
      } catch (error) {
        console.error('Failed to fetch trading history:', error);
      }
    },
    async relatedTokens() {
      try {
        const response = await TokenService.getRelatedTokens(this.contract);
        console.log('relatedTokens:', response);
      } catch (error) {
        console.error('Failed to add agent id:', error);
      }
    },
    async tokenAddAppid() {
      try {
        const response = await TokenService.addAgentId({'agentAppId':['1']});
        console.log('tokenAddAppid:', response);
      } catch (error) {
        console.error('Failed to add agent id:', error);
      }
    },
  },
  mounted() {
    this.fetchTokenDetail().then(() => {
      this.fetchKlineData();
      this.fetchComments();
      this.fetchTopHolders();
      this.fetchTradingHistory();
      this.relatedTokens();
      this.tokenAddAppid();
    });

  }
}
</script>

<style lang="scss" scoped>
.token-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 20px 20px;  // 增加顶部内边距
  color: #fff;
  
  .back-button {
    display: inline-flex;
    align-items: center;
    color: #fff;
    text-decoration: none;
    margin-bottom: 20px;
    cursor: pointer;
    transition: opacity 0.3s;

    &:hover {
      opacity: 0.8;
    }
  }

  .token-info {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 30px;
    backdrop-filter: blur(10px);
    margin-bottom: 30px;

    .token-header {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 30px;
      margin-bottom: 30px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        text-align: center;

        .token-image {
          margin: 0 auto;
        }
      }

      .token-image {
        width: 120px;
        height: 120px;
        border-radius: 15px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .token-title {
        h1 {
          font-size: 2em;
          margin: 0 0 10px;
          display: flex;
          align-items: center;
          gap: 10px;

          @media (max-width: 768px) {
            justify-content: center;
          }

          .favorite {
            font-size: 0.8em;
            color: #ffd700;
            cursor: pointer;
          }
        }

        .contract {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: monospace;
          margin-bottom: 15px;

          @media (max-width: 768px) {
            justify-content: center;
          }

          .copy-button {
            background: none;
            border: none;
            color: #7c3aed;
            cursor: pointer;
            padding: 5px;
            transition: opacity 0.3s;

            &:hover {
              opacity: 0.8;
            }
          }
        }

        .tags {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;

          @media (max-width: 768px) {
            justify-content: center;
          }

          .tag {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9em;

            &.purple {
              background: #7c3aed;
            }

            &.blue {
              background: #3b82f6;
            }
          }
        }

        .description {
          color: #E8E1F5;
          line-height: 1.6;
          margin: 0;
        }
      }
    }

    .token-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      .stat-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 15px;
        border-radius: 10px;

        .label {
          color: #8F85B8;
          font-size: 0.9em;
          margin-bottom: 5px;
        }

        .value {
          font-size: 1.2em;
          font-weight: 600;
          color: #FFFFFF;
        }

        .change {
          font-size: 0.9em;
          margin-top: 5px;

          &.negative {
            color: #ef4444;
          }

          &.positive {
            color: #10b981;
          }
        }
      }
    }
  }

  .trading-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }

    .left-section {
      .chart, .related-apps {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 30px;

        h3 {
          margin: 0 0 20px;
          font-size: 1.2em;
          color: #FFFFFF;
        }
      }

      .chart-container {
        height: 300px;
        // 添加图表相关样式
      }

      .related-apps {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 20px;
        margin-top: 20px;

        h3 {
          font-size: 1.1rem;
          margin: 0 0 15px 0;
          color: #FFFFFF;
        }

        .apps-container {
          display: flex;
          gap: 20px;
          justify-content: space-between;

          .app-item {
            flex: 1;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            transition: transform 0.3s ease;

            &:hover {
              transform: translateY(-2px);
            }

            .app-icon {
              width: 60px;
              height: 60px;
              margin: 0 auto 10px;
              border-radius: 12px;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }

            .app-info {
              .app-name {
                color: #FFFFFF;
                font-size: 0.9rem;
                font-weight: 500;
              }
            }
          }
        }
      }

      .trade-form {
        .trade-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;

          .tab {
            flex: 1;
            padding: 10px;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            color: #8F85B8;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;

            &.active {
              background: #7c3aed;
              color: #FFFFFF;
            }

            &:hover:not(.active) {
              background: rgba(255, 255, 255, 0.15);
            }
          }
        }

        .input-group {
          position: relative;
          margin-bottom: 20px;

          input {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 5px;
            color: #FFFFFF;
            font-size: 1em;

            &::placeholder {
              color: rgba(255, 255, 255, 0.5);
            }
          }

          .currency {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
          }
        }

        .quick-amounts {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 20px;

          button {
            padding: 8px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 5px;
            color: #8F85B8;
            cursor: pointer;
            transition: background 0.3s;

            &:hover {
              background: rgba(255, 255, 255, 0.15);
            }
          }
        }

        .connect-wallet {
          width: 100%;
          padding: 12px;
          background: #7c3aed;
          border: none;
          border-radius: 5px;
          color: #FFFFFF;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: #6d28d9;
          }
        }
      }

      .bonding-curve {
        .curve-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;

          h3 {
            font-size: 1.1rem;
            margin: 0;
            color: #FFFFFF;
          }

          .info-tooltip {
            cursor: pointer;
            color: #8a8a8a;
            font-size: 0.9rem;
          }
        }

        .curve-info {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #b0b0b0;

          .highlight {
            color: #FFFFFF;
            font-weight: 500;
          }
        }
      }

      .holder-distribution {
        h3 {
          font-size: 1.1rem;
          margin: 0 0 15px 0;
          color: #FFFFFF;
        }

        .distribution-list {
          .distribution-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;

            .holder {
              flex: 0 0 120px;
              font-family: monospace;
              font-size: 0.9rem;
            }

            .holder-info {
              flex: 0 0 100px;
              text-align: right;
              padding-right: 15px;

              .percentage-text {
                font-weight: 500;
                color: #FFFFFF;
              }

              .holder-type {
                font-size: 0.8rem;
                color: #8a8a8a;
              }
            }

            .percentage-bar {
              flex: 1;
              height: 6px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 3px;
              overflow: hidden;

              .bar {
                height: 100%;
                background: linear-gradient(90deg, #4a90e2, #357abd);
                border-radius: 3px;
                transition: width 0.3s ease;
              }
            }
          }
        }
      }
    }

    .right-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 100%;
      min-width: 320px;

      .related-apps {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 20px;
        margin-top: 20px;

        h3 {
          font-size: 1.1rem;
          margin: 0 0 15px 0;
          color: #FFFFFF;
        }

        .apps-container {
          display: flex;
          gap: 20px;
          justify-content: space-between;

          .app-item {
            flex: 1;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            transition: transform 0.3s ease;

            &:hover {
              transform: translateY(-2px);
            }

            .app-icon {
              width: 60px;
              height: 60px;
              margin: 0 auto 10px;
              border-radius: 12px;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }

            .app-info {
              .app-name {
                color: #FFFFFF;
                font-size: 0.9rem;
                font-weight: 500;
              }
            }
          }
        }
      }

      .tabs-container {
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;

          .tab {
            flex: 1;
            padding: 10px;
            border: none;
            background: #f0f0f0;
            color: #333;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;

            &.active {
              background: #7c3aed;
              color: #FFFFFF;
            }

            &:hover:not(.active) {
              background: rgba(255, 255, 255, 0.15);
            }
          }
        }

        .tab-content {
          .comments-section {
            .comment-form {
              margin-bottom: 20px;

              textarea {
                width: 100%;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: #FFFFFF;
                padding: 12px;
                min-height: 80px;
                resize: vertical;
                margin-bottom: 10px;
                font-size: 0.9rem;

                &:focus {
                  outline: none;
                  border-color: #4a90e2;
                }

                &::placeholder {
                  color: #51ffbd;
                }
              }

              button {
                background: #4a90e2;
                color: #FFFFFF;
                border: none;
                padding: 8px 20px;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.3s ease;
                font-size: 0.9rem;

                &:hover {
                  background: #357abd;
                }
              }
            }

            .comments-list {
              .comment-item {
                padding: 15px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 8px;
                margin-bottom: 10px;

                &:last-child {
                  margin-bottom: 0;
                }

                .comment-header {
                  display: flex;
                  align-items: center;
                  margin-bottom: 10px;

                  .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    margin-right: 10px;
                    object-fit: cover;
                  }

                  .comment-info {
                    .username {
                      font-weight: 500;
                      color: #FFFFFF;
                      font-size: 0.9rem;
                    }

                    .timestamp {
                      font-size: 0.8rem;
                      color: #8a8a8a;
                      margin-top: 2px;
                    }
                  }
                }

                .comment-content {
                  color: #b0b0b0;
                  font-size: 0.9rem;
                  line-height: 1.5;
                  word-break: break-word;
                }
              }
            }
          }

          .trading-history {
            width: 100%;
            overflow-x: auto;

            table {
              width: 100%;
              border-collapse: collapse;
              min-width: 800px;

              th, td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 0.9rem;
                white-space: nowrap;
              }

              th {
                color: #51ffbd;
                font-weight: normal;
                background: rgba(255, 255, 255, 0.02);
              }

              td {
                color: #b0b0b0;

                &.type {
                  font-weight: 500;

                  &.buy {
                    color: #00c853;
                  }

                  &.sell {
                    color: #ff3d00;
                  }
                }

                &.address {
                  font-family: monospace;
                  color: #4a90e2;
                }
              }

              tbody tr {
                transition: background 0.3s ease;

                &:hover {
                  background: rgba(255, 255, 255, 0.03);
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
