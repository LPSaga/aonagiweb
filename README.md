
# AGI open network demo

## How to run
```shell
npm i
npm run dev
```

## Connect wallet
应用启动的时候可以调用/tools/wallets里面的initPlug方法，初始化当前浏览器安装的钱包。
用户需要和链交互时，点击connect按钮，可以弹出钱包选择框，这个可以根据页面风格调整UI样式
用户选择钱包后，会将连接的钱包做一个缓存，当后续需要使用的时候拿来用

## 创建代币
在CreateCoin组件里面。用户必要填写的就是name，ticker，手续费0.04ETH在代码里面有体现，其他的需要根据业务需求添加字段，都是存中心化库里。
ticker需要查重名，组件里有方法可以参考使用
用户可以在创建的时候初始化购买代币，填写需要购买的代币数量，代码会计算需要消耗的ETH数量，这个数量是包含了扣除的手续费的
创建完成后，可以拿到创建的hash，代币合约地址，可以和填写的其他数据一起传给后端存储

## 代币列表
这个数据需要从后端拉取，前端可以从链上获取实时的数据，比如bondingcurve进度，代币是否list，这个在代码里有体现

## 交易代币
在BuyAndSellView里面包含了内盘和外盘的交易示例，具体可以看代码

## 工具代码
- aon:
    主要用于合约交易，价格查询等和合约交互的逻辑
- contract:
    读取对应的合约对象，完成链上操作
- wallets:
    钱包读取、连接、余额和交易查询等功能
- helper:
    辅助工具
- web3:
    设置钱包配置信息，切换到Base链
