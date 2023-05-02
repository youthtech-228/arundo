import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FormWrapper } from '~/components/misc/formWrapper';
import { useMarathon } from '~/contexts/marathonContext';
import { User } from '~/classes/User';
import { Button } from '~/components/misc/button';
import { FastDataTable } from '~/components/misc/fastDataTable';
import { ContentSection } from '~/components/Layout/contentSection';
import { Paginator } from '~/components/misc/pagination';
import { UserData } from '~/classes/User';
import { SearchInput } from '~/components/misc/searchInput';
import { SearchDiv } from '~/components/misc/formChangeDiv';
import usePagination from '~/hooks/usePagination';
import { DeleteIcon } from '~/components/misc/icons';
import { useSearch } from '~/hooks/useSearch';
import { ascBy, sortBy, descBy } from '~/utils';
import ReactFileReader from 'react-file-reader';
import { error, success } from '~/services/messages';
import Papa from 'papaparse';

const ImportDescription = styled.div`
  max-width: 40%;
  font-style: normal;
  font-size: 16px;
  line-height: 35px;
  color: #000000;
  margin-bottom: 30px;
`;

const IconDiv = styled.div`
  background-color: #ffffff;
  border-radius: 50px;
  width: 19px;
  height: 19px;
  cursor: pointer;
`;

const UsersInfoDiv = styled.div`
  font-style: normal;
  font-size: 16px;
  line-height: 35px;
  color: #000000;
`;

const DuplicatedNumber = styled.span`
  color: #fb7e23;
`;

const InvaildEmailNumber = styled.span`
  color: #d11d1d;
`;

export const ImportUser = ({ setFormOpen }) => {
  const {
    api: { getUserApi },
    marathon,
  } = useMarathon();

  const [importedUsers, setImportedUsers] = useState([]);
  const [invalidNumber, setInvalidNumber] = useState(0);
  const [duplicatedNumber, setDuplicatedNumber] = useState(0);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sort, setSort] = useState('ASC');
  const [sortCol, setSortCol] = useState('firstName');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    validationCheck();
    checkDuplicatedEmail();
    calculateNumbers();
  }, [importedUsers, sort]);

  const searchHook = useSearch({
    items: importedUsers,
    namespace: 'users',
    initial: {
      terms: '',
      tokens: [],
      config: {},
    },
  });
  const { highlighter, results } = searchHook;
  let byName;
  if (sort === 'ASC') {
    byName = ascBy<UserData>(sortCol);
  } else {
    byName = descBy<UserData>(sortCol);
  }

  const sortedResult = sortBy<UserData>(results, byName);
  const { current, currentPage, numberOfPages, jump } = usePagination(
    sortedResult,
    5
  );
  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { create } = getUserApi();
    setLoading(true);
    if (duplicatedNumber > 0 || invalidNumber > 0) {
      error('remove above issues !');
    } else {
      await Promise.all(
        importedUsers.map(async (user) => {
          const postUser = {
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName,
            isFederated: false,
            groupIds: [],
            productScopeId: '76d89d3a-b6a7-4a80-a3bb-6adb3c28ddc4',
            phoneNumber: null,
          };
          const response = await create(postUser);
          if (response && response.status != 'Active') {
            error(
              response?.detail
                ? response?.detail
                : 'Oops. Something went wrong.'
            );
          } else {
            marathon.users.add(response);
            success('successfully created !');
          }
        })
      );
      setLoading(false);
      marathon.refresh();
      setFormOpen(false);
    }
  };

  const onCancel = () => {
    setFormOpen(false);
  };

  const uploadCSV = (files) => {
    Papa.parse(files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (results?.data) {
          const users = results?.data?.map((row, index) => {
            const user = new User({
              id: index,
              firstName: row?.firstName,
              lastName: row?.lastName,
              email: row?.email,
            });
            return user;
          });
          setImportedUsers(users);
        }
      },
    });
  };

  const validationCheck = () => {
    importedUsers.map((user) => {
      const lastAtPos = user?.email.lastIndexOf('@');
      const lastDotPos = user?.email.lastIndexOf('.');
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          user?.email.indexOf('@@') == -1 &&
          lastDotPos > 2 &&
          user?.email.length - lastDotPos > 2
        )
      ) {
        user['invalid'] = true;
        user['styles'] = `
          background-color: #F6D2D2;
        `;
      } else {
        user['invalid'] = false;
        user['styles'] = '';
      }
      return user;
    });
  };

  const checkDuplicatedEmail = () => {
    importedUsers?.map((user) => {
      const sameEmailUsers = importedUsers.filter(
        (item) => item?.email == user?.email
      );
      if (sameEmailUsers?.length > 1) {
        user['duplicate'] = true;
        user['styles'] = `
          background-color: #FEE5D3;
        `;
      } else {
        user['duplicate'] = false;
        if (!user['styles']) user['styles'] = '';
      }
      return user;
    });
  };

  const deleteUser = (id) => {
    const filteredUsers = importedUsers?.filter((user) => user?.id != id);
    setImportedUsers(filteredUsers);
  };

  const calculateNumbers = () => {
    const sameEmailUsers = importedUsers.filter((item) => item?.duplicate);
    const invalidEmailUsers = importedUsers.filter((item) => item?.invalid);
    setDuplicatedNumber(sameEmailUsers?.length);
    setInvalidNumber(invalidEmailUsers?.length);
  };

  const cellChangeSave = (id, columnName, value) => {
    const updatedArray = importedUsers.map((user) => {
      if (user?.id == id) {
        if (columnName === 'First Name') user.firstName = value;
        else if (columnName === 'Last Name') user.lastName = value;
        else user.email = value;
      }
      return user;
    });
    setImportedUsers(updatedArray);
  };

  return (
    <FormWrapper
      title={'Import User'}
      saveButtonName={'Save'}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
    >
      <ImportDescription>
        You can import multiple users from .csv files. To make sure the file can
        be read correctly, please modify the .csv file to match the form of the
        template.
      </ImportDescription>
      <ReactFileReader
        handleFiles={uploadCSV}
        fileTypes={'.csv'}
        multipleFiles={false}
      >
        <Button whiteBg>Select a file</Button>
      </ReactFileReader>
      {importedUsers?.length > 0 ? (
        <ContentSection>
          <SearchDiv>
            <UsersInfoDiv>
              {importedUsers?.length}
              {importedUsers?.length > 1 ? 'users' : 'user'} imported,
              <DuplicatedNumber>
                {duplicatedNumber}
                {duplicatedNumber != 1 ? 'duplicates' : 'duplicate'}
              </DuplicatedNumber>
              ,
              <InvaildEmailNumber>
                {invalidNumber} incorrectly formatted email
                {invalidNumber != 1 ? 'addresses' : 'address'}
              </InvaildEmailNumber>
            </UsersInfoDiv>
            <SearchInput searchHook={searchHook} />
          </SearchDiv>
          <FastDataTable<UserData>
            columns={[
              {
                getValue: (user) => user?.id,
                render: (user) =>
                  user?.id === hoveredRow ? (
                    <IconDiv onClick={() => deleteUser(user?.id)}>
                      <DeleteIcon />
                    </IconDiv>
                  ) : (
                    <></>
                  ),
                columnStyles: `
                  width: 40px;
                  height: 60px;
                `,
              },
              {
                title: 'First Name',
                sort: 'firstName',
                getValue: (user) => user?.firstName,
              },
              {
                title: 'Last Name',
                sort: 'lastName',
                getValue: (user) => user?.lastName,
              },
              {
                title: 'Email',
                sort: 'email',
                getValue: (user) => user?.email,
              },
            ]}
            sort={sort}
            items={current}
            limit={6}
            editable={true}
            highlighter={highlighter}
            rowCursor={false}
            onChangeSave={(value, id, colName) => {
              cellChangeSave(id, colName, value);
            }}
            onChangeSort={(column, sort) => {
              if (sort == 'ASC') setSort('DESC');
              else setSort('ASC');
              setSortCol(column);
            }}
            onRowOut={() => {
              setHoveredRow(null);
            }}
            onRowHover={(_, item) => {
              setHoveredRow(item?.id);
            }}
          />
          {numberOfPages > 1 ? (
            <Paginator
              onPageChange={jump}
              currentPage={currentPage}
              pageCount={numberOfPages}
            />
          ) : (
            <></>
          )}
        </ContentSection>
      ) : (
        <></>
      )}
    </FormWrapper>
  );
};
