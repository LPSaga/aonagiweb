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
        <div class="image-upload">
          <div class="upload-box">
            <i class="upload-icon">+</i>
            <div class="upload-text">
              <div>JPEG/PNG/WEBP/GIF</div>
              <div class="size-limit">Less Than 4MB</div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>AI Agent Name *</label>
        <div class="input-wrapper">
          <input type="text" placeholder="Enter AI Agent name" maxlength="20" />
          <span class="char-count">0/20</span>
        </div>
      </div>

      <div class="form-group">
        <label>AI Agent Symbol ($Ticker) *</label>
        <div class="input-wrapper">
          <input type="text" placeholder="Enter AI Agent symbol" maxlength="10" />
          <span class="char-count">0/10</span>
        </div>
      </div>

      <div class="form-group">
        <label>AI Agent Description *</label>
        <div class="input-wrapper">
          <textarea placeholder="Enter AI Agent description" maxlength="256" rows="4"></textarea>
          <span class="char-count">0/256</span>
        </div>
      </div>

      <div class="form-group">
        <label>Website</label>
        <input type="text" placeholder="Optional" class="optional-input" />
      </div>

      <div class="form-group">
        <label>Telegram</label>
        <input type="text" placeholder="Optional" class="optional-input" />
      </div>

      <div class="form-group">
        <label>Twitter</label>
        <input type="text" placeholder="Optional" class="optional-input" />
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
          <input type="text" placeholder="Optional, Enter the amount" />
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
  data() {
    return {
      form: {
        image: null,
        name: '',
        symbol: '',
        description: '',
        website: '',
        telegram: '',
        twitter: '',
        initialBuy: '',
        fee: ''
      }
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file && file.size <= 4 * 1024 * 1024) { // 4MB limit
        // Handle file upload
      } else {
        // Show error message
      }
    },
    async createAgent() {
      // const tokenData = {
      //   name: this.form.name | 'AI Agent',
      //   symbol: this.form.symbol | 'MTK',
      //   image: this.form.image | "http://gips3.baidu.com/it/u=119870705,2790914505&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=720",
      //   contract: '0x54791a2d86e73b5f24c7921816e9251ca191c3d3',
      //   tags: '',
      //   description: this.form.description | 'This is a mock token for testing',
      //   totalSupply: '0.01',
      //   website: this.form.website | 'https://www.baidu.com',
      //   tg: this.form.telegram | 'https://www.baidu.com',
      //   x: this.form.twitter | 'https://www.baidu.com',
      //   Fee: this.form.fee | '0.01',
      //   InitialBuy: this.form.initialBuy | '0.01',
      //   createdBy: '0xb492192a8793ec8c2c00379a6de6c9dac8f3bc91'
      // };
      console.log('Creating')
      // const account = accStore.getAccountInfo;
      //   console.log('account', account)
      //   const val = 1
      //   createForm.name = 'Test bas'
      //   createForm.ticker = "AIssa1JSaa"
      //   if (await checkTickUsed(createForm.ticker)) {
      //     console.log('ticker', createForm.ticker)
      //     return;
      //   }
      //   createForm.initAmount = ethers.parseEther(val.toString())
      //   const amount = await calculateInitEth(createForm.initAmount)
      //   createForm.initEth = amount;
      //   console.log('createForm', createForm)
      //   var showingInitEth = formatPrice((createForm.initEth).toString() / 1e18)
      //   console.log('showingInitEth', showingInitEth)

      //   const tokenData = {
      //     name: 'Test bas',
      //     symbol: 'AIJ',
      //     image: "http://gips3.baidu.com/it/u=119870705,2790914505&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=720",
      //     contract: '0xc6723a6a9a9ac90191aa257ccecfa969ccd2017cc36ca57e4f1626f0f082b028',
      //     tags: '',
      //     description:  'This is a mock token for testing',
      //     totalSupply: showingInitEth,
      //     website: 'https://www.baidu.com',
      //     tg:'https://www.baidu.com',
      //     x: 'https://www.baidu.com',
      //     Fee:'0.04',
      //     InitialBuy: createForm.initEth,
      //     createdBy: accStore.ethconnectAddress
      //   };

      //   try {
      //     const response = await TokenService.createToken(tokenData);
      //     console.log('Token created successfully:', response);
      //     // 创建完成后跳转到agent列表页面
      //     this.$router.push('/agent-list');
      //   } catch (error) {
      //     console.error('Failed to create token:', error);
      //   }
      //   return

      try {
        // create token
        const val = 1
        createForm.name = 'TestAI'
        createForm.ticker = "asdddd"
        if (await checkTickUsed(createForm.ticker)) {
          console.log('ticker', createForm.ticker)
          return;
        }
        console.log('createLoading val', val.toString())
        createForm.initAmount = ethers.parseEther(val.toString())
        const amount = await calculateInitEth(createForm.initAmount)
        createForm.initEth = amount;
        var showingInitEth = formatPrice((createForm.initEth).toString() / 1e18)
        console.log('showingInitEth', showingInitEth)
        console.log('createForm', createForm)

        const {createHash, token} = await createCoin(createForm);
        console.log('createHash', createHash)
        console.log('token', token)//0xc6723a6a9a9ac90191aa257ccecfa969ccd2017cc36ca57e4f1626f0f082b028
        if (!token) return;
        createForm.createHash = createHash;
        createForm.token = token;
        // upload community info
        // delete createForm.initAmount
        // delete createForm.initEth
        // let storedToken = localStorage.getItem('tokens');
        // storedToken = storedToken ? storedToken + ',' + token : token;
        // localStorage.setItem('tokens', storedToken);

        const tokenData = {
          name: 'Test bbs',
          symbol: 'AIxnnJ',
          image: "http://gips3.baidu.com/it/u=119870705,2790914505&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=720",
          contract: token,
          tags: '',
          description:  'This is a  token for testing',
          totalSupply: showingInitEth,
          website: 'https://www.baidu.com',
          tg:'https://www.baidu.com',
          x: 'https://www.baidu.com',
          Fee:'0.04',
          InitialBuy: val,
          createdBy: accStore.ethconnectAddress
        };

        try {
          const response = await TokenService.createToken(tokenData);
          console.log('Token created successfully:', response);
          // 创建完成后跳转到agent列表页面
          this.$router.push('/agent-list');
        } catch (error) {
          console.error('Failed to create token:', error);
        }
      } catch (e) {
        console.error('create community fail', e)
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

      .image-upload {
        .upload-box {
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 30px;
          text-align: center;
          cursor: pointer;

          &:hover {
            border-color: #7c3aed;
          }

          .upload-icon {
            font-size: 2em;
            color: #51ffbd;
            margin-bottom: 10px;
          }

          .upload-text {
            color: #51ffbd;
            
            .size-limit {
              font-size: 0.9em;
              margin-top: 5px;
            }
          }
        }
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
