import React from 'react'

export default function Filters() {
    
  return(
    <React.Fragment>
      <div className="filters">
                <div className="filter search">
                    <div className="lbl">Search</div>
                    <div className="input-container search">
                        <input type="text" className="mt-10" placeholder="Search pools..."/>
                    </div>
                </div>
                <div className="filter platform">
                    <div className="lbl">Platform</div>
                    <div className="dropdown-wrapper wrapped mt-10 platform" data-value="all" data-name="All">
                        <div className="dropdown">
                            <div className="itm" data-value="-1" data-name="All">All</div>
                            <div className="itm" data-value="17" data-name="Pancake Swap V2">Pancake Swap V2</div>
                            <div className="itm" data-value="2" data-name="QBert">QBert</div>
                        </div>
                    </div>
                </div>
                <div className="filter type">
                    <div className="lbl">Type</div>
                    <div className="dropdown-wrapper mt-10 pool-type" data-value="all" data-name="All">
                        <div className="dropdown">
                            <div className="itm" data-value="-1" data-name="All">All</div>
                            <div className="itm" data-value="1" data-name="Single Token">Single Token</div>
                            <div className="itm" data-value="2" data-name="Stable Token">Stable Token</div>
                            <div className="itm" data-value="3" data-name="LP Token">LP Token</div>
                        </div>
                    </div>
                </div>

                <div className="filter asset">
                    <div className="lbl">Asset</div>
                    <div className="dropdown-wrapper wrapped mt-10 asset" data-value="all" data-name="All">
                        <div className="dropdown">
                            <div className="itm" data-value="-1" data-name="All">All</div>
                            <div className="itm" data-value="5" data-name="BNB">BNB</div>
                            <div className="itm" data-value="9" data-name="BUSD">BUSD</div>
                            <div className="itm" data-value="10" data-name="USDT">USDT</div>
                            <div className="itm" data-value="29" data-name="USDC">USDC</div>
                            <div className="itm" data-value="30" data-name="ETH">ETH</div>
                            <div className="itm" data-value="49" data-name="DAI">DAI</div>
                            <div className="itm" data-value="3" data-name="QBERT">QBERT</div>
                            <div className="itm" data-value="1003" data-name="QBERT-BNB LP">QBERT-BNB LP</div>
                            <div className="itm" data-value="1017" data-name="QBERT-BUSD LP">QBERT-BUSD LP</div>
                            <div className="itm" data-value="1018" data-name="QBERT-CAKE LP">QBERT-CAKE LP</div>
                            <div className="itm" data-value="2" data-name="CAKE">CAKE</div>
                            <div className="itm" data-value="1001" data-name="CAKE-WBNB LP">CAKE-WBNB LP</div>
                            <div className="itm" data-value="1002" data-name="CAKE-BNB LP">CAKE-BNB LP</div>                      
                        </div>
                    </div>
                </div>

                <div className="filter sort">
                    <div className="lbl">Sort by</div>
                    <div className="dropdown-wrapper wrapped mt-10 sort" data-value="default" data-name="Default">
                        <div className="dropdown">
                            <div className="itm" data-value="default" data-name="Default">Default</div>
                            <div className="itm" data-value="name" data-name="Name">Name</div>
                            <div className="itm" data-value="balance" data-name="Balance">Balance</div>
                            <div className="itm" data-value="deposited" data-name="Deposited">Deposited</div>
                            <div className="itm" data-value="apy" data-name="Yearly">Yearly</div>
                            <div className="itm" data-value="daily" data-name="Daily">Daily</div>
                            <div className="itm" data-value="tvl" data-name="TVL">TVL</div>
                        </div>
                    </div>
                </div>

                <div className="filter zero-balance">
                    <div className="checkbox-container hide-zero-balance">
                        <label className="hide-zero-balance">Show my vaults</label>
                        <input type="checkbox" id="hide-zero-balance"/>
                    </div>
                </div>
          
                </div>
    </React.Fragment>
  )
}