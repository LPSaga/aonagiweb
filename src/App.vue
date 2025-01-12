<template>
  <div class="app">
    <div class="background-container">
      <img src="https://agiopen.network/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhome-banner-bg.png&w=1920&q=75" alt="background" class="background-image" />
      <div class="overlay"></div>
    </div>

   <HeaderVue />

    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderVue from './components/Header.vue';

</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
  color: #E8E1F5;
}

.app {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;

  .background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(72, 22, 150, 0.9), rgba(143, 133, 184, 0.95));
  }
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: rgba(72, 22, 150, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(232, 225, 245, 0.1);
  z-index: 100;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(72, 22, 150, 0.1),
      rgba(143, 133, 184, 0.1)
    );
    z-index: -1;
  }

  .logo-container {
    .logo {
      height: 40px;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

.right-section {
  display: flex;
  align-items: center;
  gap: 2rem;

  .nav-menu {
    display: flex;
    gap: 2rem;
    align-items: center;

    .nav-item {
      color: #E8E1F5;
      text-decoration: none;
      font-size: 1rem;
      transition: all 0.3s ease;
      position: relative;
      padding: 0.5rem 0;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #481696, #8F85B8);
        transition: width 0.3s ease;
      }

      &:hover, &.router-link-active {
        color: #FFFFFF;
        
        &::after {
          width: 100%;
        }
      }
    }

    .dropdown {
      position: relative;
      cursor: pointer;

      .dropdown-content {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background: rgba(72, 22, 150, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(232, 225, 245, 0.1);
        border-radius: 8px;
        padding: 0.5rem 0;
        min-width: 150px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        
        a {
          display: block;
          padding: 0.5rem 1rem;
          color: #E8E1F5;
          text-decoration: none;
          transition: all 0.3s ease;
          
          &:hover {
            background: rgba(143, 133, 184, 0.2);
            color: #FFFFFF;
          }
        }
      }

      &:hover {
        .dropdown-content {
          display: block;
        }
      }
    }
  }

  .right-menu {
    .connect-wallet {
      background: #481696;
      color: #FFFFFF;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &:hover {
        background: #8F85B8;
      }
    }
  }
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  cursor: pointer;
  z-index: 100;
  
  span {
    width: 100%;
    height: 2px;
    background-color: #E8E1F5;
    transition: all 0.3s ease;
  }
  
  &.active {
    span {
      &:first-child {
        transform: translateY(9px) rotate(45deg);
      }
      
      &:nth-child(2) {
        opacity: 0;
      }
      
      &:last-child {
        transform: translateY(-9px) rotate(-45deg);
      }
    }
  }
}

@media (max-width: 768px) {
  .header {
    .hamburger {
      display: flex;
    }
    
    .right-section {
      position: fixed;
      top: 80px;
      left: 0;
      right: 0;
      background: rgba(72, 22, 150, 0.95);
      backdrop-filter: blur(10px);
      padding: 2rem;
      flex-direction: column;
      align-items: flex-start;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      
      &.active {
        transform: translateX(0);
      }
      
      .nav-menu {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        
        .nav-item {
          width: 100%;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(232, 225, 245, 0.1);
          
          &:last-child {
            border-bottom: none;
          }
        }
        
        .dropdown {
          width: 100%;
          
          .dropdown-content {
            position: static;
            background: transparent;
            border: none;
            box-shadow: none;
            padding: 0;
            margin-top: 0.5rem;
            
            a {
              padding: 0.5rem 1rem;
              margin-left: 1rem;
              border-left: 2px solid rgba(232, 225, 245, 0.1);
            }
          }
        }
      }
      
      .right-menu {
        width: 100%;
        margin-top: 1rem;
        
        .connect-wallet {
          width: 100%;
        }
      }
    }
  }
}
</style>
