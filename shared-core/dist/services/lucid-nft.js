"use strict";
/**
 * 真实的 Cardano NFT 铸造服务
 * 使用 Lucid-Cardano
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLucid = initLucid;
exports.createMintingPolicy = createMintingPolicy;
exports.mintIdentityNFTReal = mintIdentityNFTReal;
exports.checkNFTExists = checkNFTExists;
exports.getNFTMetadata = getNFTMetadata;
const lucid_1 = require("@lucid-evolution/lucid");
let lucidInstance = null;
/**
 * 初始化 Lucid 实例
 */
async function initLucid(walletApi) {
    try {
        const network = process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK || 'Preview';
        const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || '';
        if (!apiKey || apiKey === 'preview_test_key') {
            throw new Error('请配置有效的 Blockfrost API 密钥');
        }
        // 创建 Blockfrost 提供者
        const blockfrostUrl = network === 'Mainnet'
            ? `https://cardano-mainnet.blockfrost.io/api/v0`
            : `https://cardano-preview.blockfrost.io/api/v0`;
        const lucid = await lucid_1.Lucid.new(new lucid_1.Blockfrost(blockfrostUrl, apiKey), network === 'Mainnet' ? 'Mainnet' : 'Preview');
        // 连接钱包
        lucid.selectWallet(walletApi);
        lucidInstance = lucid;
        console.log('Lucid 初始化成功，网络:', network);
        return lucid;
    }
    catch (error) {
        console.error('Lucid 初始化失败:', error);
        throw error;
    }
}
/**
 * 创建 NFT 铸造 Policy
 */
async function createMintingPolicy(lucid) {
    try {
        const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address());
        if (!paymentCredential) {
            throw new Error('无法获取支付凭证');
        }
        // 创建时间锁定的铸造策略（24小时后过期）
        const lockTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        const slot = lucid.utils.unixTimeToSlot(lockTime);
        const mintingPolicy = lucid.utils.nativeScriptFromJson({
            type: 'all',
            scripts: [
                {
                    type: 'sig',
                    keyHash: paymentCredential.hash
                },
                {
                    type: 'before',
                    slot: slot
                }
            ]
        });
        const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
        console.log('铸造策略创建成功:', policyId);
        return {
            policyId,
            policy: mintingPolicy
        };
    }
    catch (error) {
        console.error('创建铸造策略失败:', error);
        throw error;
    }
}
/**
 * 真实的铸造身份 NFT
 */
async function mintIdentityNFTReal(walletApi, metadata) {
    try {
        console.log('开始真实铸造 NFT...');
        // 初始化 Lucid
        const lucid = await initLucid(walletApi);
        // 创建铸造策略
        const { policyId, policy } = await createMintingPolicy(lucid);
        // 生成资产名称
        const assetName = 'CardanoIdentity' + Date.now();
        // 将资产名称转换为十六进制
        const assetNameHex = Buffer.from(assetName, 'utf8').toString('hex');
        const unit = policyId + assetNameHex;
        console.log('铸造信息:', {
            policyId,
            assetName,
            assetNameHex,
            unit
        });
        // 构建 NFT metadata (CIP-25 标准)
        const nftMetadata = {
            [policyId]: {
                [assetName]: {
                    name: metadata.name,
                    image: metadata.image,
                    description: metadata.description || '',
                    mediaType: 'image/jpeg',
                    attributes: metadata.attributes || [],
                    properties: {
                        privacy: metadata.privacy,
                        encrypted: metadata.encrypted || false,
                        authorizedAddresses: metadata.authorizedAddresses || [],
                        timestamp: metadata.timestamp,
                        version: metadata.version
                    }
                }
            }
        };
        console.log('NFT Metadata:', nftMetadata);
        // 构建铸造交易
        console.log('构建铸造交易...');
        const mintAssets = {};
        mintAssets[unit] = 1n;
        const tx = await lucid
            .newTx()
            .mintAssets(mintAssets)
            .validTo(Date.now() + 200000)
            .attachMintingPolicy(policy)
            .attachMetadata(721, nftMetadata)
            .complete();
        console.log('✅ 交易构建成功');
        console.log('签名交易...');
        const signedTx = await tx.sign().complete();
        console.log('✅ 交易签名成功');
        console.log('提交交易到区块链...');
        const txHash = await signedTx.submit();
        console.log('✅ NFT 铸造交易已提交:', txHash);
        console.log('⏳ 等待区块链确认...');
        // 等待交易确认（最多等待 3 分钟）
        await lucid.awaitTx(txHash, 180000);
        console.log('🎉 NFT 铸造成功！');
        return {
            policyId,
            assetName,
            txHash,
            unit
        };
    }
    catch (error) {
        console.error('❌ NFT 铸造失败:', error);
        console.error('错误堆栈:', error.stack);
        // 提供更详细的错误信息
        if (error.message?.includes('UTxO Balance Insufficient') || error.message?.includes('insufficient')) {
            throw new Error('钱包余额不足！需要至少 5 ADA 来支付交易费用和最小 UTXO 要求');
        }
        else if (error.message?.includes('Collateral') || error.message?.includes('collateral')) {
            throw new Error('需要设置抵押品(Collateral)！请在钱包设置中添加抵押品 UTXO');
        }
        else if (error.message?.includes('API key') || error.message?.includes('403') || error.message?.includes('401')) {
            throw new Error('Blockfrost API 密钥无效或已过期！请检查 .env.local 配置');
        }
        else if (error.message?.includes('unreachable')) {
            throw new Error('WASM 模块错误！这可能是由于浏览器兼容性问题，请尝试刷新页面或使用 Chrome 浏览器');
        }
        throw new Error(`铸造失败: ${error.message || '未知错误'}`);
    }
}
/**
 * 查询 NFT 是否存在
 */
async function checkNFTExists(policyId, assetName) {
    try {
        if (!lucidInstance) {
            return false;
        }
        const assetNameHex = Buffer.from(assetName, 'utf8').toString('hex');
        const unit = policyId + assetNameHex;
        const utxos = await lucidInstance.wallet.getUtxos();
        // 检查钱包中是否有该 NFT
        return utxos.some(utxo => utxo.assets && Object.keys(utxo.assets).includes(unit));
    }
    catch (error) {
        console.error('检查 NFT 失败:', error);
        return false;
    }
}
/**
 * 获取 NFT metadata
 */
async function getNFTMetadata(policyId, assetName) {
    try {
        const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY;
        const network = process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK || 'Preview';
        if (!apiKey || apiKey === 'preview_test_key') {
            return null;
        }
        const baseUrl = network === 'Mainnet'
            ? 'https://cardano-mainnet.blockfrost.io/api/v0'
            : 'https://cardano-preview.blockfrost.io/api/v0';
        const assetNameHex = Buffer.from(assetName, 'utf8').toString('hex');
        const assetId = policyId + assetNameHex;
        const response = await fetch(`${baseUrl}/assets/${assetId}`, {
            headers: {
                'project_id': apiKey
            }
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.onchain_metadata;
    }
    catch (error) {
        console.error('获取 NFT metadata 失败:', error);
        return null;
    }
}
