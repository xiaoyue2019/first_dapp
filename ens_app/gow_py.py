from web3 import Web3
from ._abi import abi1_control,abi2_reg,abi3_resolver,abi4_test
import random,time
from namehash import namehash
from web3.middleware import geth_poa_middleware
import random


# ---------------设置提供商----------------
w3 = Web3(Web3.HTTPProvider('https://ropsten.infura.io/v3/5e91213112f649588f92530b4d0bb4cf'))
# w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)


# --------------合约地址设置-------------------
contract_add=w3.toChecksumAddress('0x283af0b28c62c092c9727f1ee09c02ca627eb7f5')  #控制器    注册器
contract_add_reg=w3.toChecksumAddress('0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e')  #注册表 
contract_add_resolver=w3.toChecksumAddress('0x42d63ae25990889e35f215bc95884039ba354115')   #解析器
contract_add_test=w3.toChecksumAddress('0x3BCbD316417017EA6105Fa09a1760412D3200ebB')   #测试合约


# --------------合约名字设置-------------------
con=w3.eth.contract(contract_add,abi=abi1_control)  #控制器
con_reg=w3.eth.contract(contract_add_reg,abi=abi2_reg)  #注册表
con_resolver=w3.eth.contract(contract_add_resolver,abi=abi3_resolver)   #解析器
con_test=w3.eth.contract(contract_add_test,abi=abi4_test)   #测试合约


# ---------------域名设置----------------------
domain='zhongxinguoji'       #域名
subnode_domain='test1'  #子域名


# --------------账户及私钥设置-----------------
private='53AC54C436B939A037BA69772997BA736172CCAF3D7CB87F56B5A8C0120E456B'
private_test='023b88f33943189f8641ef5880cac02ac1a974d710f54276a2383cf318762076'
address='0x11767c122Dd7B9F0F3e97a195f0CBA0a64c0C9c8'
address2='0x70DCe49AF9485cF361d9B67a1B78777E624f4eA0'
address_test='0xac5CdbD4DaeA43307bFdfE702CCb7046dA1a680E'
salt=w3.keccak(text='我干啊还要随机数？？'+str(random.randint(1,9999))).hex()
resolver=w3.toChecksumAddress('42d63ae25990889e35f215bc95884039ba354115') #公共解析器
com_token=(
    '4giDsYyErSNLEEP8oz',
    'D6EEd1qT8puGQaz91y'
)



def available(_domain):
    return con.functions.available(_domain).call()

def commit():
    temp=con.functions.makeCommitmentWithConfig(domain,address,salt,resolver,address).call().hex() #提交域名、地址、随机数，获取commit
    print(temp)
    transaction = con.functions.commit(temp).buildTransaction({ #打包交易发送commit
        'gas': 2000000,
        'gasPrice': w3.toWei('40', 'gwei'),
        'nonce': w3.eth.getTransactionCount(address),
    })
    print(transaction)
    signed_tx=w3.eth.account.signTransaction(transaction,private)   #使用私钥签名
    tx_hash=w3.eth.sendRawTransaction(signed_tx.rawTransaction)     #发送签名后的交易
    re=w3.eth.waitForTransactionReceipt(tx_hash)        #等待交易成功后返回数据（下同）
    print(re)

def register():
    price=con.functions.rentPrice(domain,31556952).call()*1.2
    transaction = con.functions.registerWithConfig(domain,address,31556952,salt,resolver,address).buildTransaction({
        'value':int(price),
        'gas': 2000000,
        'gasPrice': w3.toWei('40', 'gwei'),
        'nonce': w3.eth.getTransactionCount(address),
    })
    print(transaction)
    signed_tx=w3.eth.account.signTransaction(transaction,private)
    tx_hash=w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    re=w3.eth.waitForTransactionReceipt(tx_hash)
    print(re)

# function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl);
# namehash('alice.eth')  node ，将 keccak256('iam')  label

def setsubnode(_subnode_domain):
    transaction = con_reg.functions.setSubnodeRecord(namehash(domain+'.eth'),w3.keccak(text=_subnode_domain),address,resolver,0).buildTransaction({
        'gas': 2000000,
        'gasPrice': w3.toWei('40', 'gwei'),
        'nonce': w3.eth.getTransactionCount(address),
    })
    # print(transaction)
    signed_tx=w3.eth.account.signTransaction(transaction,private)
    tx_hash=w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    w3.eth.waitForTransactionReceipt(tx_hash)
    # print(re)



def setadd(_subnode_domain,_address):
    node=namehash(_subnode_domain+'.'+domain+'.eth')
    transaction = con_resolver.functions.setAddr(node,_address).buildTransaction({
        'gas': 2000000,
        'gasPrice': w3.toWei('40', 'gwei'),
        'nonce': w3.eth.getTransactionCount(address),
    })
    # print(transaction)
    signed_tx=w3.eth.account.signTransaction(transaction,private)
    tx_hash=w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    w3.eth.waitForTransactionReceipt(tx_hash)
    # print(re)


def get_event(tx_hash):
    receipt = w3.eth.getTransactionReceipt(tx_hash)
    a=con_test.events.view_domain().processReceipt(receipt)
    return(a[0]['args'])


def control(_add_hash,token=1):
    if token:
        w3.eth.waitForTransactionReceipt(_add_hash)
        res=get_event(_add_hash)
        if res['boo']==True:
            _subdomain=res['domain']
            _add=res['add']
            print(_subdomain,_add)
            setsubnode(_subdomain)
            setadd(_subdomain,_add)
            return True
        else:
            return False
    else:
        print(_add_hash,token)
        if token not in com_token:
            return False
        else:
            return True


if __name__ == "__main__":
    # available()
    # commit()  #向控制器发送域名注册信息做个小备案，并接受key
    # time.sleep(60)   #等待60秒
    # register()    #向控制器发送注册信息和key，备案生效

    # setsubnode('mm')  #第一步新建三级域名
    # setadd('mm',address2)  #第二步把域名解析到address2
    
    # print(get_event('0x889bcc01174868f844811b9ba77e43a26a3011cb79dfa6097b792d28bb0d8e21')['domain'])
    # control('0x889bcc01174868f844811b9ba77e43a26a3011cb79dfa6097b792d28bb0d8e21')
    print(con_reg.functions.owner(namehash('.eth')).call())
