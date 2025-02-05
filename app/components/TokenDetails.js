"use client"
import React, { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Header from './Header';
import images from '../constants/images';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../services/supabase.js';
import { Loader } from './Loader';
import Link from 'next/link';

export function TokenDetails() {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pairData, setPairData] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const theme = "light"

  useEffect(() => {
    const fetchPairData = async () => {
      try {
        const response = await fetch(
          'https://api.dexscreener.com/latest/dex/pairs/base/0xe31c372a7af875b3b5e0f3713b17ef51556da667'
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPairData(data);
        console.log(data)
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPairData();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchToken = async () => {
        console.log(token)
        const { data, error } = await supabase
          .from('token')
          .select('*')
          .eq('id', id)
          .single(); // Get a single record

        if (error) console.error(error);
        else {
          setToken(data);
          console.log(token)
          setLoading(false);
        }
      };
      fetchToken();
    }
  }, [id]);

  return (

    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex w-full p-6">
        {/* Left Section */}
        {loading ?
          <div className="flex w-[50%] items-center justify-center h-64">
            <Loader className="text-[#7C7C7C]" size="text-7xl" />

          </div>
          :
          <div className='flex w-full flex-col'>
            <div className='flex items-center px-4 gap-6'>
              <div className='flex gap-3'>
                <img className="w-[50px] h-[50px] rounded-full border-[1px] border-[#D5D5D5]" src={pairData?.pair?.info?.imageUrl} />
                <p className="text-[#000000] font-primary font-semibold text-[36px]">{pairData?.pair?.baseToken?.symbol}</p>
              </div>
              <div className='flex items-end mt-3 gap-3'>
                <p className="text-[#7C7C7C] font-normal text-[12px]">{`${pairData?.pair?.baseToken?.address?.substring(0, 6)}...${pairData?.pair?.baseToken?.address?.substring(pairData?.pair?.baseToken?.address?.length - 4)}`}</p>
                <div className="flex gap-6 items-end ">
                  <div className="flex gap-2 justify-center items-center">
                    <Image style={{ color: "#7C7C7C" }} width={40} alt="Token" height={40} src={images.website} className="w-[10px] h-[10px] flex items-center justify-center text-[#C7C7C7]" />
                    <Link href={pairData?.pair?.info?.socials[0]?.url} target='_blank'>
                      <p className="text-[#7C7C7C] font-normal font-secondary text-[12px]">Website</p>
                    </Link>

                  </div>
                  <div className="flex gap-2 justify-center items-center">
                    <Image style={{ color: "#7C7C7C" }} width={40} alt="Token" height={40} src={images.twitter} className="w-[10px] h-[10px] flex items-center justify-center text-[#C7C7C7]" />
                    <Link href={pairData?.pair?.info?.socials[0]?.url} target='_blank'>
                      <p className="text-[#7C7C7C] font-normal font-secondary text-[12px]">Twitter</p>
                    </Link>

                  </div>
                  <div className="flex gap-2 justify-center items-center">
                    <Image style={{ color: "#7C7C7C" }} width={40} alt="Token" height={40} src={images.telegram} className="w-[10px] h-[10px] flex items-center justify-center text-[#C7C7C7]" />
                    <Link href={pairData?.pair?.info?.socials[0]?.url} target='_blank'>
                      <p className="text-[#7C7C7C] font-normal font-secondary text-[12px]">Telegram</p>
                    </Link>

                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col px-4  w-full'>
              <div className="w-full rounded-lg  ">
                <iframe
                  className="w-full h-fit bg-gray-100 min-h-[64vh] mt-4 rounded-lg"
                  src="https://www.geckoterminal.com/base/pools/0xe31c372a7af875b3b5e0f3713b17ef51556da667?embed=1&info=0&swaps=0&chart=1"
                  frameBorder="0"
                ></iframe>
              </div>
              <div className='border-[1px] mt-4 border-[#D5D5D5]'>
                <div className=" flex justify-start items-start border-b border-[#D5D5D5] ">

                  <div>
                    <button
                      className={`flex-1 w-fit py-2 text-left font-secondary  p-4  border-r border-[#D5D5D5] font-normal ${activeTab === "description"
                        ? "  text-[18px] text-[#000000]"
                        : "text-[#D5D5D5] text-[18px]"
                        }`}
                      onClick={() => setActiveTab("description")}
                    >
                      DESCRIPTION
                    </button>
                  </div>
                  <div>
                    <button
                      className={`flex-1 w-fit py-2 text-left font-secondary  p-4  border-r border-[#D5D5D5] font-normal ${activeTab === "holders"
                        ? "  text-[18px] text-[#000000]"
                        : "text-[#D5D5D5] text-[18px]"
                        }`}
                      onClick={() => setActiveTab("holders")}
                    >
                      HOLDER DITRIBUTION (136)
                    </button>
                  </div>
                </div>


                <div className="">
                  {activeTab === "description" ? (
                    <p className="text-[#000000] p-4 mt-4 font-primary text-left font-normal text-[12px] w-full">
                      {token?.description}
                    </p>
                  ) : (
                    <div className='flex p-4 justify-between'>

                      <div className='  '>

                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >Cb2rttt</p>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >73dggy</p>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >9332BH7UNN (dev)</p>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >Cb2rttt</p>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >73dggy</p>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >9332BH7UNN (dev)</p>
                      </div>
                      <div className='  '>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>

                      </div>

                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        }

        {/* Right Section */}
        {loading ?
          <div className="flex w-[50%] items-center justify-center h-64">
            <Loader className="text-[#7C7C7C]" size="text-7xl" />

          </div>
          :
          <div className='flex w-[50%] mt-10 flex-col'>
            <iframe
              src="https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&theme=light"
              width="100%"
              style={{
                height: "500px"
              }}
            // style="
            //   border: 0;
            //   margin: 0 auto;
            //   margin-bottom: .5rem;
            //   display: block;
            //   border-radius: 10px;
            //   max-width: 960px;
            //   min-width: 300px;
            // "
            />
            {/* <div
              style={{ borderRadius: "5px", cursor: "pointer" }}
              className="border-[1px] mt-6 border-[#D5D5D5] text-center bg-white relative"
            >


              
              <div className=" px-4 text-center">


              </div>
              <div className="flex px-4 gap-3">
                <button style={{ borderRadius: "4px" }} className="w-full text-[#FFFFFF] mt-4 px-8 py-2 font-bold font-primary text-[14px] bg-[#39B906] ">BUY</button>
                <button style={{ borderRadius: "4px" }} className="w-full text-[#D5D5D5] mt-4 px-8 py-2 font-bold font-primary text-[14px] border-[1px] border-[#D5D5D5] ">SELL</button>

              </div>
              <div className='flex px-4 mt-4 justify-between items-center'>
                <p className='text-[#7C7C7C] font-normal font-secondary text-[12px]'>switch to $GEARTH</p>
                <p className='text-[#7C7C7C] font-normal font-secondary text-[12px]'>set max slippage</p>
              </div>
              <div className='px-4 mt-4'>
                <div className='flex px-4 py-2 border-[1px] border-[#D5D5D5]'>
                  <input
                    type="text"
                    className=" w-full text-[14px] placeholder:font-secondary placeholder:text-[#7C7C7C]"
                    placeholder='0.00'
                  />
                  <div className='flex justify-center items-center gap-2'>
                    <p className='text-[#000000] font-primary text-[14px] font-bold'>$EARTH</p>
                    <Image
                      className="w-[20px] h-[20px]"
                      src={images.earthcoin} alt='coin' width={40} height={40} />
                  </div>
                </div>
                <button style={{ borderRadius: "4px" }} className="w-full text-[#FFFFFF] mt-4 px-8 py-2 font-bold font-primary text-[14px] bg-[#39B906] ">PLACE TRADE</button>
              </div>

              <div className='px-4 flex flex-col gap-2 justify-center items-center mt-4'>
                <p className='text-[#000000] font-primary font-bold text-[13px]'>You will receive 0 $GEARTH</p>
                <p className='text-[#7C7C7C] font-secondary font-normal text-[12px]'>~0.00% of supply</p>
              </div>
              <div className='flex items-center px-4 mt-4  border-t-[1px] border-[#D5D5D5] justify-between'>
                <p className='w-full font-secondary text-[#7C7C7C] text-[12px] py-2 border-r-[1px]'>Basescan</p>
                <p className='w-full font-secondary text-[#7C7C7C] text-[12px] py-2 border-r-[1px]'>Dexscreener</p>
                <p className='w-full font-secondary text-[#7C7C7C] text-[12px] py-2 '>Uniswap</p>
              </div>
            </div> */}

            <div className='flex justify-between gap-0 mt-4  border-[1px] border-[#D5D5D5]'>
              <div className=' px-4 py-1 border-r-[1px]  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >5M</p>
                <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>{`${pairData?.pair?.priceChange?.m5}%`}</p>
              </div>
              <div className=' px-4 py-1 border-r-[1px]  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >1H</p>
                <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>{`${pairData?.pair?.priceChange?.h1}%`}</p>
              </div>
              <div className=' px-4 py-1 border-r-[1px]  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >6H</p>
                <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>{`${pairData?.pair?.priceChange?.h6}%`}</p>
              </div>
              <div className=' px-4 py-1 '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >24H</p>
                <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>{`${pairData?.pair?.priceChange?.h24}%`}</p>
              </div>
              {/* <p className='w-full font-secondary text-[#7C7C7C] text-[12px] p-2 border-r-[1px]'>Basescan</p>
            <p className='w-full font-secondary text-[#7C7C7C] text-[12px] p-2 border-r-[1px]'>Dexscreener</p>
            <p className='w-full font-secondary text-[#7C7C7C] text-[12px] p-2 '>Uniswap</p> */}
            </div>

            <div className='flex flex-col p-2  mt-4  border-[1px] border-[#D5D5D5]'>
              <div className='flex justify-between'>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >24H VOL</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>${(pairData?.pair?.volume?.h24 / 1000000).toFixed(2)}M</p>
                </div>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >LIQUITITY</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>${(pairData?.pair?.liquidity?.usd / 1000000).toFixed(2)}M</p>
                </div>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >HOLDERS</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>$127.38M</p>
                </div>
              </div>

              <div className='flex  justify-between'>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >AGE</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>22 days</p>
                </div>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >FDV</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>${(pairData?.pair?.fdv / 1000000).toFixed(2)}M</p>
                </div>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >MARKET CAP</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>${(pairData?.pair?.marketCap / 1000000).toFixed(2)}M</p>
                </div>
              </div>


            </div>

            <div className='flex flex-col p-4 gap-4 mt-4 border-[1px] border-[#D5D5D5]'>
              <div>
                <p className='w-full text-left font-secondary text-[#7C7C7C] font-normal text-[12px] ' >HOLDER DITRIBUTION (136)</p>
              </div>
              <div className='flex justify-between'>

                <div className='  '>

                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >Cb2rttt</p>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >73dggy</p>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >9332BH7UNN (dev)</p>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >Cb2rttt</p>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >73dggy</p>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >9332BH7UNN (dev)</p>
                </div>
                <div className='  '>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                  <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>

                </div>

              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}