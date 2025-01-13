<template>
  <div class="launch-page">
    <h1>Launch your <span class="highlight">AI Agent</span></h1>

    <div class="features">
      <div class="feature-card">
        <div class="icon">
        </div>
        <h3>No Presale</h3>
      </div>
      <div class="feature-card">
        <div class="icon">
        </div>
        <h3>No Team Allocation</h3>
      </div>
      <div class="feature-card">
        <div class="icon">
        </div>
        <h3>Lower Gas</h3>
      </div>
    </div>

    <div class="launch-form">
      <div class="form-group">
        <label>Image *</label>
        <el-upload
          class="upload-demo"
          drag
          action=""
          :on-change="handleImageUpload"
          :before-upload="beforeUpload"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/webp,image/gif"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          <div class="el-upload__tip" slot="tip">JPEG/PNG/WEBP/GIF, less than 4MB</div>
        </el-upload>
      </div>

      <div class="form-group">
        <label>AI Agent Name *</label>
        <div class="input-wrapper">
          <input type="text" placeholder="Enter AI Agent name" maxlength="20" v-model="form.name"/>
          <span class="char-count">0/20</span>
        </div>
      </div>

      <div class="form-group">
        <label>AI Agent Symbol ($Ticker) *</label>
        <div class="input-wrapper">
          <input type="text" placeholder="Enter AI Agent symbol" maxlength="10" v-model="form.ticker"/>
          <span class="char-count">0/10</span>
        </div>
      </div>

      <div class="form-group">
        <label>AI Agent Description *</label>
        <div class="input-wrapper">
          <textarea placeholder="Enter AI Agent description" maxlength="256" rows="4" v-model="form.description"></textarea>
          <span class="char-count">0/256</span>
        </div>
      </div>

      <div class="form-group">
        <label>Website</label>
        <input type="text" placeholder="Optional" class="optional-input" v-model="form.website"/>
      </div>

      <div class="form-group">
        <label>Telegram</label>
        <input type="text" placeholder="Optional" class="optional-input" v-model="form.telegram"/>
      </div>

      <div class="form-group">
        <label>Twitter</label>
        <input type="text" placeholder="Optional" class="optional-input" v-model="form.twitter"/>
      </div>

      <div class="form-group">
        <label>Agent Creation Fee</label>
        <div class="amount-input">
          <input type="text" value="0.04" readonly />
          <div class="currency">
            ETH
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Initial Buy <span class="subtitle">be the first person to buy your AI Agent</span></label>
        <div class="amount-input">
          <input type="text" placeholder="Optional, Enter the amount" v-model="form.initialBuyAmount"/>
          <div class="currency">
            ETH 
          </div>
        </div>
        <div class="balance">Balance: 0 ETH You will receive 0 （0%）  Trading Fee(1%)</div>
      </div>

      <div class="form-actions">
        <button class="create-button" @click="createAgent">Create AI Agent</button>
      </div>
    </div>

    <div class="footer">
      <div class="copyright"> 2024 AonPump. All rights reserved</div>
      <div class="terms">
        This site is protected by reCAPTCHA and the Google 
        <a href="#" class="link">Privacy Policy</a> and 
        <a href="#" class="link">Terms of Service</a> apply.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TokenService } from '../services/tokenService';
import { useAccountStore, EthWalletState } from '@/stores/web3'
import { createCoin, calculateInitEth, checkTickUsed } from "@/tools/aon";
import { reactive, ref} from 'vue';
import { ethers } from "ethers";
import { formatPrice, formatAmount } from '@/tools/helper'
import { ElMessage, ElUpload } from 'element-plus'

const accStore = useAccountStore();
type CreateFormData = {
  name: string,
  ticker: string,
  token: string,
  createHash?: string,
  initAmount?: bigint // this is token amount
  initEth?: bigint // this is eth amount
}
const createForm = reactive<CreateFormData> ({
    name: "",
    ticker: "",
    token: "",
})

export default {
  name: 'Launch',
  components: {
    ElMessage,
    ElUpload
  },
  data() {
    return {
      form: {
        image: null,
        name: '',
        ticker: '',
        description: '',
        website: '',
        telegram: '',
        twitter: '',
        initialBuyAmount: '', // Ensure this property is initialized
        fee: ''
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt4M = file.size / 1024 / 1024 < 4;
      if (!isLt4M) {
        this.showError('File size must be less than 4MB.');
      }
      return isLt4M;
    },
    handleImageUpload(file) {
      this.form.image = file.raw;
    },
    showError(message) {
      ElMessage({
        showClose: true,
        message: message,
        type: 'error',
        customClass: 'center-message'
      })
    },
    async createAgent() {
      // Check for mandatory fields
      console.log('form data', this.form)
      if (!this.form.name || !this.form.ticker || !this.form.description) {
        this.showError('The fields name, symbol, and description are required.');
        return;
      }
      console.log('Creating')
      try {
        // create token
        createForm.name = this.form.name
        createForm.ticker = this.form.ticker
        if (await checkTickUsed(createForm.ticker)) {
          this.showError('This symbol has been created.');
          return;
        }
        const val = this.form.initialBuyAmount | 0
        createForm.initAmount = ethers.parseEther(val.toString())
        const amount = await calculateInitEth(createForm.initAmount)
        createForm.initEth = amount;
        var showingInitEth = formatPrice((createForm.initEth).toString() / 1e18)

        const {createHash, token} = await createCoin(createForm);
        console.log('token', token)
        if (!token) return;
        createForm.createHash = createHash;
        createForm.token = token;

        const tokenData = {
          name: this.form.name | '',
          symbol: this.form.ticker | '',
          image: this.form.image | "http://gips3.baidu.com/it/u=119870705,2790914505&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=720",
          contract: token,
          tags: '',
          description: this.form.description | '',
          totalSupply: showingInitEth,
          website: this.form.website | '',
          tg: this.form.telegram | '',
          x: this.form.twitter | '',
          Fee: this.form.fee | '0.04',
          InitialBuy: this.form.initialBuyAmount | '',
          createdBy: accStore.ethconnectAddress
        };
        try {
          const response = await TokenService.createToken(tokenData);
          console.log('Token created successfully:', response);
          // 创建完成后跳转到agent列表页面
          this.$router.push('/agent-list');
        } catch (error) {
          console.error('Failed to create token:', error);
          this.showError('Failed to create token.');
        }
      } catch (e) {
        console.error('create community fail', e)
        this.showError('Failed to create token.');
      } finally {

      }
    }
  }
}
</script>

<style lang="scss" scoped>
.launch-page {
  padding: 120px 20px 40px;  // 增加顶部内边距
  max-width: 800px;
  margin: 0 auto;
  color: #fff;

  h1 {
    text-align: center;
    font-size: 2.5em;
    margin-bottom: 40px;

    .highlight {
      background: linear-gradient(45deg, #7c3aed, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .features {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 40px;

    .feature-card {
      text-align: center;

      .icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 15px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      h3 {
        font-size: 1em;
        font-weight: normal;
        color: #fff;
      }
    }
  }

  .launch-form {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 30px;

    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        margin-bottom: 10px;
        color: #fff;

        .subtitle {
          font-size: 0.9em;
          color: #51ffbd;
          margin-left: 10px;
        }
      }

      .el-upload {
        width: 100%;
      }

      .el-upload__tip {
        font-size: 0.9em;
        color: #51ffbd;
      }

      .input-wrapper {
        position: relative;

        .char-count {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #51ffbd;
          font-size: 0.9em;
        }
      }

      input, textarea {
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        color: #fff;
        padding: 12px;
        font-size: 1em;

        &::placeholder {
          color: #51ffbd;
        }

        &:focus {
          outline: none;
          border-color: #7c3aed;
        }
      }

      textarea {
        resize: vertical;
      }

      .optional-input {
        background: rgba(255, 255, 255, 0.05);
      }

      .amount-input {
        position: relative;

        .currency {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 5px;
          color: #51ffbd;

          .currency-icon {
            width: 20px;
            height: 20px;
          }
        }
      }

      .balance {
        margin-top: 5px;
        font-size: 0.9em;
        color: #51ffbd;
      }
    }

    .form-actions {
      margin-top: 20px;
      text-align: center;

      .create-button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background: #45a049;
        }
      }
    }
  }

  .footer {
    text-align: center;
    margin-top: 40px;
    color: #51ffbd;
    font-size: 0.9em;

    .copyright {
      margin-bottom: 10px;
    }

    .link {
      color: #7c3aed;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.launch {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
  background-color: inherit;
}
</style>
