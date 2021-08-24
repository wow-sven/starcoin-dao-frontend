import React, { useMemo, useState } from 'react';
import {
  Flex,
  Spinner,
  Input,
  InputGroup,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { RiArrowDropDownFill } from 'react-icons/ri';

import { useParams } from 'react-router';
import { useFormModal } from '../contexts/OverlayContext';
import { useMetaData } from '../contexts/MetaDataContext';
import ListSelectorItem from '../components/ListSelectorItem';
import List from '../components/list';
import ListSelector from '../components/ListSelector';
import ListItem from '../components/listItem';
import TextBox from '../components/TextBox';
import NoListItem from '../components/NoListItem';

import { isLastItem } from '../utils/general';
import { BOOSTS, allBoosts, categories } from '../data/boosts';
import { validate } from '../utils/validation';

const handleSearch = (boostsArr, str) => {
  if (!str) return boostsArr;
  if (!boostsArr?.length) return [];
  return boostsArr.filter(boostID =>
    BOOSTS[boostID].boostContent.title.toLowerCase().includes(str),
  );
};

const checkAvailable = (boostData, daochain) =>
  boostData.networks === 'all' ||
  validate.address(boostData.networks[daochain]);

const checkBoostInstalled = (boostData, daoMetaData) => {
  console.log(`daoMetaData`, daoMetaData);
  return daoMetaData.boosts[boostData.id || boostData.oldId];
};

const processBoosts = ({
  daoMetaData,
  boostsKeyArray,
  searchStr,
  daochain,
}) => {
  if (!Array.isArray(boostsKeyArray) || !daoMetaData || !daochain) return;
  return handleSearch(boostsKeyArray, searchStr).map(boostKey => {
    const boostData = BOOSTS[boostKey];
    return {
      ...BOOSTS[boostKey],
      isAvailable: checkAvailable(boostData, daochain),
      isInstalled: checkBoostInstalled(boostData, daoMetaData),
    };
  });
};

const generateNoListMsg = (selectedListID, searchStr) => {
  if (selectedListID && !searchStr) return 'No Proposals Added';
  if (selectedListID && searchStr)
    return `Could not find proposal with title ${searchStr}`;
  if (!selectedListID) return 'Select a Playlist';
  return 'Not Found';
};

const Market = () => {
  const { daoMetaData } = useMetaData();

  const [categoryID, setID] = useState('all');

  const selectCategory = id => {
    if (!id) return;
    if (id === categoryID) {
      setID(null);
    } else {
      setID(id);
    }
  };

  return (
    <Flex flexDir='column' w='95%'>
      {daoMetaData ? (
        <Flex>
          <CategorySelector
            categoryID={categoryID}
            selectList={selectCategory}
            allBoosts={allBoosts}
          />
          <BoostsList categoryID={categoryID} allBoosts={allBoosts} />
        </Flex>
      ) : (
        <Spinner />
      )}
    </Flex>
  );
};

const CategorySelector = ({ selectList, categoryID, allBoosts }) => {
  return (
    <ListSelector
      topListItem={
        <ListSelectorItem
          listLabel={{
            left: 'All Boosts',
            right: allBoosts?.boosts?.length || 0,
          }}
          isTop
          id='all'
          isSelected={categoryID === 'all'}
          selectList={selectList}
        />
      }
      divider='Categories'
      lists={categories?.map((cat, index) => (
        <ListSelectorItem
          key={cat.id}
          id={cat.id}
          selectList={selectList}
          isSelected={cat.id === categoryID}
          listLabel={{ left: cat.name, right: cat.boosts?.length }}
          isBottom={isLastItem(categories, index)}
        />
      ))}
    />
  );
};

const BoostsList = ({ categoryID, installed }) => {
  const { openFormModal } = useFormModal();
  const { daoMetaData } = useMetaData();

  const [searchStr, setSearchStr] = useState(null);
  const { daochain } = useParams();

  const currentCategory = useMemo(() => {
    if (!categoryID || !categories || !daoMetaData) return;
    if (categoryID === 'all') {
      return processBoosts({
        daochain,
        boostsKeyArray: allBoosts.boosts,
        searchStr,
        daoMetaData,
      });
    }
    const boostList = categories.find(cat => cat.id === categoryID)?.boosts;
    return processBoosts({
      daochain,
      boostsKeyArray: boostList,
      searchStr,
      daoMetaData,
    });
  }, [categoryID, categories, searchStr, daoMetaData]);

  const handleTypeSearch = e =>
    setSearchStr(e.target.value.toLowerCase().trim());
  const installBoost = boost => openFormModal({ boost });
  const openDetails = boost => openFormModal({ steps: 'bort' });
  const goToSettings = boost => {
    console.log(boost);
  };

  return (
    <List
      headerSection={
        <>
          <InputGroup w='250px' mr={6}>
            <Input placeholder='Search Boosts' onChange={handleTypeSearch} />
          </InputGroup>
          <TextBox p={2}>Sort By:</TextBox>
          <Menu isLazy>
            <MenuButton
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
              color='secondary.500'
              _hover={{ color: 'secondary.400' }}
              display='inline-block'
            >
              Available
              <Icon as={RiArrowDropDownFill} color='secondary.500' />
            </MenuButton>
            <MenuList>
              <MenuItem>Title</MenuItem>
            </MenuList>
          </Menu>
        </>
      }
      list={
        currentCategory?.length > 0 ? (
          currentCategory.map(boost => {
            return (
              <ListItem
                key={boost.id}
                title={boost?.boostContent?.title}
                description={boost?.boostContent?.description}
                menuSection={
                  <BoostItemButton
                    boost={boost}
                    installBoost={installBoost}
                    goToSettings={goToSettings}
                    openDetails={openDetails}
                  />
                }
                // helperText={getHelperText(boost)}
              />
            );
          })
        ) : (
          <NoListItem>
            <TextBox>{generateNoListMsg(categoryID, searchStr)}</TextBox>
          </NoListItem>
        )
      }
    />
  );
};

export default Market;

const BoostItemButton = ({
  boost,
  openDetails,
  installBoost,
  goToSettings,
}) => {
  const cost = boost?.cost?.toUpperCase();
  if (!boost.isAvailable) {
    const handleClick = () => openDetails(boost);
    return (
      <Flex flexDir='column' alignItems='flex-end'>
        <Button variant='ghost' p={0} onClick={handleClick}>
          <TextBox color='secondary.500'>Details</TextBox>
        </Button>
        <TextBox
          variant='body'
          mt={3}
          opacity='0.8'
          size='sm'
          fontStyle='italic'
        >
          Unavailable on network - {cost}
        </TextBox>
      </Flex>
    );
  }
  if (!boost.isInstalled) {
    const handleClick = () => installBoost(boost);
    return (
      <Flex flexDir='column' alignItems='flex-end'>
        <Button variant='ghost' onClick={handleClick} p={0}>
          <TextBox color='secondary.500'>Install</TextBox>
        </Button>
        <TextBox variant='body' mt={3} opacity='0.8' size='sm'>
          {cost}
        </TextBox>
      </Flex>
    );
  }
  if (boost.isInstalled) {
    const handleClick = () => goToSettings(boost);
    return (
      <Flex flexDir='column' alignItems='flex-end'>
        <Button variant='ghost' p={0} onClick={handleClick} color='red'>
          <TextBox color='secondary.500'>Settings</TextBox>
        </Button>
        <TextBox
          variant='body'
          mt={3}
          opacity='0.8'
          fontStyle='italic'
          size='sm'
        >
          installed
        </TextBox>
      </Flex>
    );
  }
  return null;
};
