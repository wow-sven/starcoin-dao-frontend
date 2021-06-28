import React, { useState, useEffect } from 'react';
import deepEqual from 'deep-eql';
import { useParams } from 'react-router-dom';
import { Wrap, WrapItem, Flex, Button, Box } from '@chakra-ui/react';
import MainViewLayout from '../components/mainViewLayout';
import GalleryNftCard from '../components/galleryNftCard';
import NftFilter from '../components/nftFilter';
import NftSort from '../components/nftSort';
import { nftFilterOptions, nftSortOptions } from '../utils/nftContent';

const DUMMY_DATA = [
  {
    title: 'NFT 1',
    description: 'Blah',
    creator: 'Twisted',
    last_price: '110',
    collection: 'Rarible',
    link: 'https://rarible.com/something',
    list_price: '1',
  },
  {
    title: 'NFT 2',
    description: 'Blah',
    creator: 'Twisted',
    last_price: '1000',
    collection: 'Nifty',
    link: 'https://rarible.com/something',
    list_price: '20000',
    auction: {
      start: '100',
      end: '10',
      start_price: '100',
      end_price: '100',
    },
    offers: [
      {
        offeror: '0x',
        price: '10',
      },
    ],
  },
  {
    title: 'NFT 3',
    description: 'Blah',
    creator: 'Twisted',
    last_price: '100',
    collection: 'Rarible',
    link: 'https://rarible.com/something',
    list_price: '3',
    auction: {
      start: '100',
      end: '1',
      start_price: '100',
      end_price: '100',
    },
    offers: [
      {
        offeror: '0x',
        price: '10',
      },
    ],
  },
];

const MinionGallery = ({ daoVaults, customTerms }) => {
  const { minion } = useParams();
  const [vault, setVault] = useState(null);
  const [sort, setSort] = useState(null);
  const [filters, setFilters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [collection, setCollection] = useState('all');
  const [allCollections, setAllCollections] = useState([]);
  const [nfts, setNfts] = useState(null);
  const [nftData, setNftData] = useState(null);

  // Grab Vault
  useEffect(() => {
    setVault(
      daoVaults?.find(vault => {
        return vault.address === minion;
      }),
    );
  }, [daoVaults, minion]);

  // Grab NFTs
  useEffect(() => {
    if (vault && vault.nfts) {
      setNftData(DUMMY_DATA);
      setNfts(DUMMY_DATA);
    }
  }, [vault]);

  // Get All Collections
  useEffect(() => {
    if (nftData) {
      const collections = nftData.reduce((acc, item) => {
        if (acc.indexOf(item.collection) === -1) {
          return [...acc, item.collection];
        }
        return acc;
      }, []);
      if (!deepEqual(collections, allCollections)) {
        setAllCollections(collections);
      }
    }
  }, [nftData]);

  // Filter NFTs
  useEffect(() => {
    if (nftData) {
      const filtered = nftData.filter(item => {
        let result = true;
        if (searchText.length > 0) {
          result =
            result &&
            (item.title.includes(searchText) ||
              item.description.includes(searchText));
        }
        if (filters.length > 0) {
          if (filters.indexOf('forSale') !== -1) {
            result = result && !!item.auction;
          }
          if (filters.indexOf('hasOffer') !== -1) {
            result = result && !!item.offers && item.offers.length > 0;
          }
        }
        if (collection !== 'all') {
          result = result && collection === item.collection;
        }
        return result;
      });
      if (!deepEqual(filtered, nfts)) {
        setNfts(filtered);
      }
    }
  }, [searchText, collection, filters, nftData]);

  // Sort NFTs
  useEffect(() => {
    if (nfts && nfts.length > 0) {
      const sorted = [...nfts];
      sorted.sort((a, b) => {
        if (sort.value === 'value') {
          return +b.last_price - +a.last_price;
        }
        if (sort.value === 'dateCreated') {
          return 0;
        }
        if (sort.value === 'expiringAuctions') {
          if (a.auction && !b.auction) {
            return -1;
          }
          if (b.auction && !a.auction) {
            return 1;
          }
          if (a.auction && b.auction) {
            return +a.auction.end - +b.auction.end;
          }
          return 0;
        }
        return -1;
      });
      if (!deepEqual(sorted, nfts)) {
        setNfts([...sorted]);
      }
    }
  }, [sort, nfts]);

  const addButton = (
    <Flex>
      <Button>ADD NFT +</Button>
    </Flex>
  );

  return (
    <MainViewLayout
      header='Minion Gallery'
      customTerms={customTerms}
      headerEl={addButton}
      isDao
    >
      {vault && (
        <Flex d='column'>
          <Flex
            wrap={['wrap', null, null, 'nowrap']}
            justify={['space-between', null, null, 'flex-start']}
            align='center'
            w='100%'
            mt={[0, null, null, 10]}
            mb={10}
          >
            <Box
              mr={[0, 5, null, 5]}
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
            >
              {nfts?.length || 0} NFTs
            </Box>
            <Box ml={[0, 5, null, 10]}>
              <NftSort sort={sort} setSort={setSort} options={nftSortOptions} />
            </Box>
            <Box ml={[0, 5, null, 10]} mt={[5, 0, null, 0]}>
              <NftFilter
                ml={0}
                filters={filters}
                setFilters={setFilters}
                searchText={searchText}
                setSearchText={setSearchText}
                collection={collection}
                setCollection={setCollection}
                allCollections={allCollections}
                options={nftFilterOptions}
              />
            </Box>
            <Box
              ml='auto'
              mt={[5, 0, null, 0]}
              mr={[0, 5, null, 5]}
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
            >
              View Balances
            </Box>
          </Flex>
          <Wrap flex={1} spacing={4} w='90%'>
            {nfts &&
              nfts.length > 0 &&
              nfts.map((nft, i) => (
                <WrapItem key={i}>
                  <GalleryNftCard nft={nft} />
                </WrapItem>
              ))}
          </Wrap>
        </Flex>
      )}
    </MainViewLayout>
  );
};

export default MinionGallery;
