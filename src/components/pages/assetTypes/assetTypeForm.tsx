import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import Switch from '~/components/misc/switchButton';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { AssetType } from '~/classes/AssetType';
import { SearchableSelect } from '@dccs/react-searchable-select-mui';
import { FormWrapper } from '~/components/misc/formWrapper';
import { FormControlCustom } from '~/components/misc/formControl';
import { useMarathon } from '~/contexts/marathonContext';
import { sortByName } from '~/utils';

const SearchableSelection = styled(SearchableSelect)`
  width: 100%;
`;

interface FormProps {
  setEditOpen: (edit: boolean) => void;
  setFormOpen: (edit: boolean) => void;
  edit: boolean;
  assetType: AssetType;
}

export const Form = ({
  setEditOpen,
  setFormOpen,
  edit,
  assetType,
}: FormProps) => {
  if (!assetType) {
    return null;
  }
  const {
    currentAssetType,
    assetTypes,
    groups,
    units,
    tagTypes,
    api: { getAssetTypeApi },
  } = useMarathon();
  if (edit) {
    assetType = currentAssetType || assetTypes.getRoot();
  }

  const { create, update } = getAssetTypeApi(assetType?.id);
  const [loading] = useState(false);
  const [name, setName] = useState(assetType?.name ? assetType.name : '');
  const [parentId, setParentId] = useState(assetType?.parentId);
  const [notificationGroupId, setNotificationGroupId] = useState(
    assetType?.notificationGroupId ? assetType.notificationGroupId : null
  );
  const [unit, setUnit] = useState(
    assetType?.unit ? assetType.unit : null
  );
  const [timeseries, setTimeseries] = useState(
    !!assetType?.assetViewId
  );

  const filterUnits = () => {
    if (units) {
      const tagType = tagTypes.find((t) => t?.id == assetType?.id);
      const tagTypeUnit = units.find((u) => u.name == tagType?.name ?? tagType.unitEnum);
      return tagType && tagType.unit
          ? units.filter((u) => u.dimension == tagTypeUnit?.dimension)
          : [];
    }
    return [];
  };
  const handleParentChange = (event) => {
    setParentId(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'notificationGroupId') {
      setNotificationGroupId(event.target.value);
    } else if (event.target.name === 'unitId') {
      setUnit(event.target.value);
    }
  };

  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const postType = {
      name: name,
      dataSourceId: assetType?.dataSourceId,
      eventTypeId: null,
      unit: unit,
      parentId: parentId,
      assetViewId: timeseries ? '15bd27f4-8fd6-11ea-ac7c-acde48001122' : null,
      notificationGroupId: notificationGroupId,
    };

    if (!parentId || parentId == '') {
      postType.parentId = null;
    }

    if (!unit || unit == '') {
      postType.unit = null;
    }

    if (
      !notificationGroupId ||
      notificationGroupId === '' ||
      notificationGroupId === 'None'
    ) {
      postType.notificationGroupId = null;
    }

    if (edit) {
      await update(assetType?.id, postType, window.location.href);
    } else {
      await create(postType, window.location.href);
    }
    e.preventDefault();
  };

  const onCancel = () => {
    setEditOpen(false);
    setFormOpen(false);
  };
  return (
    <FormWrapper
      title={edit ? 'Edit Asset Type' : 'Create Asset Type'}
      saveButtonName={edit ? 'Save' : 'Create'}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
  >
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6}>
          <InputLabel>Data on time series</InputLabel>
          <Switch
            onChange={() => setTimeseries(!timeseries)}
            checked={timeseries}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Tag Type</InputLabel>
          <br />
          <span>{assetType?.dataSourceId ? 'Tag' : 'None'}</span>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Name*</InputLabel>
          <br />
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Parent</InputLabel>
          <FormControlCustom>
            <SearchableSelection
              value={parentId}
              onChange={handleParentChange}
              options={assetTypes}
            />
          </FormControlCustom>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Display Unit</InputLabel>
          <br />
          <FormControlCustom>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              name="unitId"
              onChange={handleChange}
              value={unit}
            >
              <MenuItem value={null}>{'None'}</MenuItem>
              {units &&
                filterUnits()
                  .sort(sortByName)
                  .map((row, index) => (
                    <MenuItem key={index} value={row.name}>
                      {row.name}
                    </MenuItem>
                  ))}
            </Select>
          </FormControlCustom>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel id="demo-simple-select-label">
            Notification Group
          </InputLabel>
          <br />
          <FormControlCustom>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              name="notificationGroupId"
              value={notificationGroupId}
              onChange={handleChange}
            >
              <MenuItem value={null}>{'None'}</MenuItem>
              {groups &&
                groups.map((row, index) => (
                  <MenuItem key={index} value={row.id}>
                    {row.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControlCustom>
        </Grid>
      </Grid>
    </FormWrapper>
  );
};
