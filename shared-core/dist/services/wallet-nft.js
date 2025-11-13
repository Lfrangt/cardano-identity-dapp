"use strict";
/**
 * 使用纯钱包 CIP-30 API 铸造 NFT
 * 避免 lucid-cardano 的 WASM 问题
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintIdentityNFTWithWallet = mintIdentityNFTWithWallet;
// Cardano 序列化库类型（运行时动态加载）
let CardanoWasm = null;
/**
 * 延迟加载 Cardano WASM 库
 */
async function loadCardanoWasm() {
    if (!CardanoWasm) {
        CardanoWasm = await Promise.resolve().then(() => __importStar(require('@emurgo/cardano-serialization-lib-browser')));
    }
    return CardanoWasm;
}
/**
 * 将十六进制字符串转换为 Uint8Array
 */
function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}
/**
 * 将 Uint8Array 转换为十六进制字符串
 */
function bytesToHex(bytes) {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
/**
 * 使用钱包 API 铸造身份 NFT
 */
async function mintIdentityNFTWithWallet(walletApi, metadata) {
    try {
        console.log('🚀 开始使用钱包 API 铸造 NFT...');
        // 加载 Cardano WASM 库
        const CSL = await loadCardanoWasm();
        console.log('✅ Cardano WASM 库加载成功');
        // 获取网络信息
        const networkIdRaw = await walletApi.getNetworkId();
        const networkId = typeof networkIdRaw === 'string' ? parseInt(networkIdRaw) : networkIdRaw;
        console.log('网络 ID:', networkId);
        // 获取钱包地址
        const changeAddressHex = await walletApi.getChangeAddress();
        const changeAddress = CSL.Address.from_bytes(hexToBytes(changeAddressHex));
        console.log('钱包地址:', changeAddress.to_bech32());
        // 获取钱包 UTXOs
        const utxosHex = await walletApi.getUtxos();
        if (!utxosHex || utxosHex.length === 0) {
            throw new Error('钱包中没有可用的 UTXO，请确保钱包中有足够的 ADA');
        }
        console.log('找到', utxosHex.length, '个 UTXOs');
        // 解析 UTXOs
        const utxos = CSL.TransactionUnspentOutputs.new();
        for (const utxoHex of utxosHex) {
            const utxo = CSL.TransactionUnspentOutput.from_bytes(hexToBytes(utxoHex));
            utxos.add(utxo);
        }
        // 创建交易构建器
        const txBuilder = CSL.TransactionBuilder.new(CSL.TransactionBuilderConfigBuilder.new()
            .fee_algo(CSL.LinearFee.new(CSL.BigNum.from_str('44'), CSL.BigNum.from_str('155381')))
            .pool_deposit(CSL.BigNum.from_str('500000000'))
            .key_deposit(CSL.BigNum.from_str('2000000'))
            .max_value_size(5000)
            .max_tx_size(16384)
            .coins_per_utxo_byte(CSL.BigNum.from_str('4310'))
            .build());
        // 生成 Policy Script (基于钱包的 pubkey)
        // 尝试多种地址类型
        let paymentKeyHash;
        const baseAddress = CSL.BaseAddress.from_address(changeAddress);
        if (baseAddress) {
            paymentKeyHash = baseAddress.payment_cred().to_keyhash();
        }
        else {
            // 尝试 Enterprise Address
            const enterpriseAddress = CSL.EnterpriseAddress.from_address(changeAddress);
            if (enterpriseAddress) {
                paymentKeyHash = enterpriseAddress.payment_cred().to_keyhash();
            }
            else {
                // 尝试 Pointer Address
                const pointerAddress = CSL.PointerAddress.from_address(changeAddress);
                if (pointerAddress) {
                    paymentKeyHash = pointerAddress.payment_cred().to_keyhash();
                }
            }
        }
        if (!paymentKeyHash) {
            throw new Error('无法从钱包地址获取 payment key hash');
        }
        console.log('✅ Payment Key Hash:', bytesToHex(paymentKeyHash.to_bytes()));
        // 使用保守的估算方法获取当前 slot
        // Preview testnet: 每秒 1 slot, 创世时间约 2022-10-25 (实际可能更晚)
        // 由于无法准确获取，我们使用足够大的 TTL 缓冲
        const currentTime = Math.floor(Date.now() / 1000);
        // Preview testnet 实际运行时间估算（根据错误信息推断）
        // currentSlot 约 168388869，对应的创世时间
        const genesisTime = currentTime - 168390000; // 保守估计
        const currentSlot = currentTime - genesisTime;
        console.log('✅ 当前时间戳:', currentTime);
        console.log('✅ 估算创世时间:', genesisTime);
        console.log('✅ 估算当前 Slot:', currentSlot);
        // 创建简单的签名验证 Policy Script
        // 注意：为了确保唯一性，我们使用 TTL 作为有效期限制，而不是在 script 中添加时间锁定
        const keyHashScript = CSL.ScriptPubkey.new(paymentKeyHash);
        const mintingScript = CSL.NativeScript.new_script_pubkey(keyHashScript);
        const policyId = bytesToHex(CSL.ScriptHash.from_bytes(mintingScript.hash().to_bytes()).to_bytes());
        console.log('✅ Policy ID:', policyId);
        // 生成资产名称
        const assetName = 'CardanoIdentity' + Date.now();
        const assetNameBytes = new TextEncoder().encode(assetName);
        const assetNameCSL = CSL.AssetName.new(assetNameBytes);
        const unit = policyId + bytesToHex(assetNameBytes);
        console.log('✅ Asset Name:', assetName);
        console.log('✅ Unit:', unit);
        // 创建 Mint 资产
        const mintAssets = CSL.Assets.new();
        mintAssets.insert(assetNameCSL, CSL.BigNum.from_str('1'));
        const mintBuilder = CSL.MintBuilder.new();
        const scriptSource = CSL.NativeScriptSource.new(mintingScript);
        const mintWitness = CSL.MintWitness.new_native_script(scriptSource);
        mintBuilder.add_asset(mintWitness, assetNameCSL, CSL.Int.new_i32(1));
        // 构建 NFT metadata (CIP-25 标准)
        // 注意：Cardano metadata 不支持布尔值，需要转换为字符串
        const nftMetadata = {
            [policyId]: {
                [assetName]: {
                    name: metadata.name,
                    image: metadata.image,
                    description: metadata.description || '',
                    mediaType: 'image/jpeg',
                    attributes: (metadata.attributes || []).map(attr => ({
                        trait_type: attr.trait_type,
                        value: String(attr.value) // 确保所有值都是字符串
                    })),
                    properties: {
                        privacy: metadata.privacy,
                        encrypted: metadata.encrypted ? 'true' : 'false', // 布尔值转字符串
                        authorizedAddresses: metadata.authorizedAddresses || [],
                        timestamp: String(metadata.timestamp), // 数字转字符串
                        version: metadata.version
                    }
                }
            }
        };
        console.log('📋 NFT Metadata:', nftMetadata);
        // 添加 metadata
        const generalMetadata = CSL.GeneralTransactionMetadata.new();
        const metadataJson = JSON.stringify(nftMetadata);
        const metadataValue = CSL.encode_json_str_to_metadatum(metadataJson, CSL.MetadataJsonSchema.BasicConversions);
        generalMetadata.insert(CSL.BigNum.from_str('721'), metadataValue);
        const auxData = CSL.AuxiliaryData.new();
        auxData.set_metadata(generalMetadata);
        // 设置交易有效期 (validity interval) - 必须在添加输出之前设置
        // 使用较大的缓冲时间（2小时）来应对 slot 估算误差
        const ttl = currentSlot + 7200; // 2 小时后过期（7200 slots = 2 小时）
        console.log('✅ 交易 TTL 设置:');
        console.log('  - 估算当前 Slot:', currentSlot);
        console.log('  - TTL Slot:', ttl);
        console.log('  - 有效期缓冲:', ttl - currentSlot, 'slots (约', (ttl - currentSlot) / 60, '分钟)');
        // 重要：先设置 TTL 和辅助数据
        txBuilder.set_ttl(ttl);
        txBuilder.set_auxiliary_data(auxData);
        txBuilder.set_mint_builder(mintBuilder);
        // 创建包含铸造的 NFT 的输出
        const mintedValue = CSL.Value.new(CSL.BigNum.from_str('2000000')); // 2 ADA
        const mintedAssets = CSL.MultiAsset.new();
        const policyAssets = CSL.Assets.new();
        policyAssets.insert(assetNameCSL, CSL.BigNum.from_str('1'));
        mintedAssets.insert(CSL.ScriptHash.from_bytes(hexToBytes(policyId)), policyAssets);
        mintedValue.set_multiasset(mintedAssets);
        const outputWithNFT = CSL.TransactionOutput.new(changeAddress, mintedValue);
        txBuilder.add_output(outputWithNFT);
        // 选择输入以支付费用（使用 RandomImproveMultiAsset 策略支持 NFT）
        txBuilder.add_inputs_from(utxos, CSL.CoinSelectionStrategyCIP2.RandomImproveMultiAsset);
        // 添加找零地址
        txBuilder.add_change_if_needed(changeAddress);
        // 构建交易
        const txBody = txBuilder.build();
        // 验证交易体中的 TTL
        const txBodyTTL = txBody.ttl();
        const txBodyTTLValue = txBodyTTL ? (typeof txBodyTTL === 'object' && txBodyTTL.to_str ? txBodyTTL.to_str() : String(txBodyTTL)) : 'undefined';
        console.log('🔍 交易体验证:');
        console.log('  - 交易体 TTL:', txBodyTTLValue);
        console.log('  - 交易体 TTL 类型:', typeof txBodyTTL);
        console.log('  - 预期 TTL:', ttl);
        if (!txBodyTTL || txBodyTTLValue === '0' || txBodyTTLValue === 'undefined') {
            throw new Error(`交易 TTL 未正确设置！交易体 TTL: ${txBodyTTLValue}, 预期: ${ttl}`);
        }
        const witnessSet = CSL.TransactionWitnessSet.new();
        const tx = CSL.Transaction.new(txBody, witnessSet, auxData);
        console.log('✅ 交易构建成功');
        // 使用钱包签名
        console.log('✍️ 请在钱包中签名交易...');
        const txHex = bytesToHex(tx.to_bytes());
        console.log('交易 Hex 长度:', txHex.length);
        const witnessSetHex = await walletApi.signTx(txHex, true);
        console.log('✅ 交易已签名');
        console.log('Witness Set Hex 长度:', witnessSetHex.length);
        // 组装完整的签名交易
        const witnessSetSigned = CSL.TransactionWitnessSet.from_bytes(hexToBytes(witnessSetHex));
        // 添加 native script 到 witness set (钱包只签名支付密钥，不包含脚本)
        const witnessNativeScripts = CSL.NativeScripts.new();
        witnessNativeScripts.add(mintingScript);
        witnessSetSigned.set_native_scripts(witnessNativeScripts);
        const signedTx = CSL.Transaction.new(tx.body(), witnessSetSigned, tx.auxiliary_data());
        // 提交交易
        console.log('📡 正在提交交易到区块链...');
        const signedTxHex = bytesToHex(signedTx.to_bytes());
        console.log('签名交易 Hex 长度:', signedTxHex.length);
        try {
            const submittedTxHash = await walletApi.submitTx(signedTxHex);
            console.log('✅ 交易已提交:', submittedTxHash);
            return {
                policyId,
                assetName,
                txHash: submittedTxHash,
                unit
            };
        }
        catch (submitError) {
            console.error('❌ 交易提交失败详细信息:');
            console.error('错误对象:', submitError);
            console.error('错误类型:', typeof submitError);
            console.error('错误消息:', submitError.message);
            console.error('错误 info:', submitError.info);
            console.error('错误 code:', submitError.code);
            console.error('完整 JSON:', JSON.stringify(submitError, null, 2));
            throw new Error(`交易提交失败: ${submitError.message || submitError.info || submitError.code || '未知错误'}`);
        }
    }
    catch (error) {
        console.error('❌ NFT 铸造失败:', error);
        // 详细错误信息
        if (error.message?.includes('UTxO Balance Insufficient')) {
            throw new Error('钱包余额不足！需要至少 5 ADA 来支付交易费用和最小 UTXO 要求');
        }
        else if (error.message?.includes('Collateral')) {
            throw new Error('需要设置抵押品(Collateral)！请在钱包设置中添加抵押品 UTXO');
        }
        throw new Error(`铸造失败: ${error.message || '未知错误'}`);
    }
}
