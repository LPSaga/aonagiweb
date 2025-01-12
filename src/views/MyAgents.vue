<template>
  <div class="my-agents">
    <div class="content-wrapper">
      <div class="header-section">
        <h1>My Tokenized Agent</h1>
      </div>

      <div class="agent-grid">
        <div class="agent-card" v-for="(agent, index) in myAgents" :key="index">
          <router-link :to="'/token/' + agent.id" class="agent-link">
            <div class="agent-image">
              <img :src="agent.image" :alt="agent.name" />
            </div>
            <div class="agent-info">
              <h3>{{ agent.name }}</h3>
              <p class="description">{{ agent.description }}</p>
              <div class="stats">
                <div class="stat">
                  <span class="label">Price</span>
                  <span class="value">{{ agent.price }}</span>
                  <span :class="['change', agent.priceChange >= 0 ? 'positive' : 'negative']">
                    {{ agent.priceChange >= 0 ? '+' : '' }}{{ agent.priceChange }}%
                  </span>
                </div>
                <div class="stat">
                  <span class="label">Market Cap</span>
                  <span class="value">${{ agent.marketCap }}</span>
                </div>
              </div>
              <div class="linked-apps">
                <div class="app-list" v-if="agent.linkedApps && agent.linkedApps.length > 0">
                  <div class="app-item" v-for="(app, appIndex) in agent.linkedApps" :key="appIndex">
                    {{ app }}
                    <span class="remove-app" @click.prevent="removeLinkedApp(index, appIndex)">×</span>
                  </div>
                </div>
                <button class="link-app-btn" @click.prevent="showLinkAppDialog(index)">
                  + Link App
                </button>
              </div>
            </div>
          </router-link>
        </div>

        <!-- 创建新Agent的卡片 -->
        <router-link to="/launch" class="create-card">
          <div class="create-content">
            <div class="plus-icon">+</div>
            <span>Create New Agent</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>

  <!-- 添加关联APPID的弹窗 -->
  <div class="dialog-overlay" v-if="showDialog" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <h3>Link New App</h3>
      <input v-model="newAppId" placeholder="Enter App ID" class="app-id-input">
      <div class="dialog-buttons">
        <button @click="closeDialog" class="cancel-btn">Cancel</button>
        <button @click="addLinkedApp" class="confirm-btn">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyAgents',
  data() {
    return {
      showDialog: false,
      newAppId: '',
      selectedAgentIndex: null,
      myAgents: [
        {
          id: 'myagent1',
          name: 'My First Agent',
          image: require('@/assets/llama3.jpg'),
          description: 'A powerful AI agent for natural language processing',
          price: '0.000042 ETH',
          priceChange: 3.75,
          marketCap: '12.34k',
          linkedApps: []
        },
        {
          id: 'myagent2',
          name: 'Code Assistant',
          image: require('@/assets/codecopilot.jpg'),
          description: 'Intelligent coding assistant with multi-language support',
          price: '0.000038 ETH',
          priceChange: -1.25,
          marketCap: '9.87k',
          linkedApps: []
        }
      ]
    }
  },
  methods: {
    showLinkAppDialog(agentIndex) {
      this.selectedAgentIndex = agentIndex;
      this.showDialog = true;
      this.newAppId = '';
    },
    closeDialog() {
      this.showDialog = false;
      this.selectedAgentIndex = null;
      this.newAppId = '';
    },
    addLinkedApp() {
      if (!this.newAppId.trim()) return;
      
      const agent = this.myAgents[this.selectedAgentIndex];
      if (!agent.linkedApps) {
        this.$set(agent, 'linkedApps', []);
      }
      agent.linkedApps.push(this.newAppId.trim());
      this.closeDialog();
    },
    removeLinkedApp(agentIndex, appIndex) {
      this.myAgents[agentIndex].linkedApps.splice(appIndex, 1);
    }
  }
}
</script>

<style lang="scss" scoped>
.my-agents {
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
      margin: 80px 0 40px;

      h1 {
        font-size: 2.5rem;
        color: #fff;
        margin: 0;
      }
    }

    .agent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;

      .agent-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        .agent-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .agent-image {
          width: 100%;
          height: 200px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .agent-info {
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
                color: #b0b0b0;
                margin-bottom: 5px;
              }

              .value {
                font-size: 1rem;
                font-weight: 500;
              }

              .change {
                font-size: 0.9rem;
                margin-top: 2px;

                &.positive {
                  color: #10b981;
                }

                &.negative {
                  color: #ef4444;
                }
              }
            }
          }

          .linked-apps {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);

            .app-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-bottom: 10px;

              .app-item {
                background: rgba(255, 255, 255, 0.1);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 6px;

                .remove-app {
                  cursor: pointer;
                  opacity: 0.6;
                  &:hover {
                    opacity: 1;
                  }
                }
              }
            }

            .link-app-btn {
              background: transparent;
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: #fff;
              padding: 6px 12px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.9rem;
              transition: all 0.3s ease;

              &:hover {
                background: rgba(255, 255, 255, 0.1);
              }
            }
          }
        }
      }

      .create-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
        transition: transform 0.3s ease;
        text-decoration: none;
        color: inherit;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.08);
        }

        .create-content {
          text-align: center;

          .plus-icon {
            font-size: 3rem;
            color: #6366f1;
            margin-bottom: 10px;
          }

          span {
            color: #fff;
            font-size: 1.1rem;
          }
        }
      }
    }
  }
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .dialog-content {
    background: #1a1a1a;
    padding: 24px;
    border-radius: 12px;
    min-width: 300px;

    h3 {
      margin: 0 0 20px 0;
      color: #fff;
    }

    .app-id-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      margin-bottom: 20px;

      &:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.4);
      }
    }

    .dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 12px;

      button {
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;

        &.cancel-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        }

        &.confirm-btn {
          background: #3b82f6;
          border: none;
          color: #fff;

          &:hover {
            background: #2563eb;
          }
        }
      }
    }
  }
}
</style>
