import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {
const sampleData = [
    {
        "name": "NFT#1",
        "description": "Cracked Baby NFT",
        
        "image":"https://gateway.pinata.cloud/ipfs/QmPLxJjoW7bPFe5518xMEiAK7v1vsNQJuZFEw4sLx9pTdS",
        "price":"0.003ETH",
        "currentlySelling":"True",
        "address":"0xDB60C74Ff8A7673216C2B5dfD5557DAfd2F7d9Eb",
    },
    {
        "name": "NFT#2",
        "description": "Cracker coin NFT",
        
        "image":"https://gateway.pinata.cloud/ipfs/QmS7m3cR96Gk6pWTFpfCNfGLib42aYTx1kDjSrRQigTWcq",
        "price":"0.003ETH",
        "currentlySelling":"True",
        "address":"0xDB60C74Ff8A7673216C2B5dfD5557DAfd2F7d9Eb",
    },
    {
        "name": "NFT#3",
        "description": "Cracked Treasure NFT",
       
        "image":"https://gateway.pinata.cloud/ipfs/QmPfPdxuBMdzZPZx3rUoNdRnPqxhXB9MZLWme9aTEzZyBb",
        "price":"0.003ETH",
        "currentlySelling":"True",
        "address":"0xDB60C74Ff8A7673216C2B5dfD5557DAfd2F7d9Eb",
    },
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                Top NFTs
            </div>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}