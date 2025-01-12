<template>
  <div class="token-card">
    <div class="token-image">
      <img :src="token.image" :alt="token.name" />
      <span class="price-change" :class="{ positive: isPositive }">
        {{ token.priceChange }}
      </span>
    </div>
    <div class="token-info">
      <div class="creator">
        Created By: {{ token.creator }}
      </div>
      <h3 class="token-name">{{ token.name }}</h3>
      <p class="token-description">{{ token.description }}</p>
      <div class="market-cap">
        Market Cap: {{ token.marketCap }}
        <span class="market-cap-change">{{ token.marketCapChange }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TokenCard',
  props: {
    token: {
      type: Object,
      required: true
    }
  },
  computed: {
    isPositive() {
      return this.token.priceChange.startsWith('+')
    }
  }
}
</script>

<style lang="scss" scoped>
.token-card {
  background: rgba(18, 18, 23, 0.8);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

.token-image {
  position: relative;
  width: 100%;
  padding-top: 100%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .price-change {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;

    &.positive {
      color: #10b981;
    }
  }
}

.token-info {
  padding: 1rem;

  .creator {
    font-size: 0.875rem;
    color: #6c7080;
    margin-bottom: 0.5rem;
  }

  .token-name {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .token-description {
    font-size: 0.875rem;
    color: #6c7080;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .market-cap {
    font-size: 0.875rem;
    color: #ffffff;

    .market-cap-change {
      color: #6c7080;
      margin-left: 0.5rem;
    }
  }
}
</style>
