import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { TextField, createTheme } from '@material-ui/core';
import { FormWrapper } from '~/components/misc/formWrapper';
import { useMarathon } from '~/contexts/marathonContext';
import { ascBy } from '~/utils';
import { Checkbox } from '@arundo/marathon-shared';
import { SelectInput, SeveritySelectInput } from '~/components/misc/select';
import { FastDataTable } from '~/components/misc/fastDataTable';
import { SwitchForVisibility } from '~/components/misc/switchButton';
import { makeStyles } from '@material-ui/core/styles';
import {
  AsteriskColorSpan,
  HelpIcon,
  RemoveIcon,
} from '~/components/misc/icons';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { TreeSelect } from '~/components/misc/treeSelect';
import { EventAssetType } from '~/classes/EventType';
import { IconButton } from '@arundo/marathon-shared';

const formLabelsTheme = createTheme({
  overrides: {
    MuiFormLabel: {
      asterisk: {
        color: '#fb7e23',
        '&$error': {
          color: '#db3131',
        },
      },
    },
  },
});

const useStyles = makeStyles(() => ({
  inputLabel: {
    color: 'black',
    marginBottom: '15px',
    marginTop: '15px',
    minWidth: '200px',
    display: 'flex',
    alignItems: 'center',
  },
  inputDescription: {
    marginBottom: '0px',
    width: '100%',
    marginLeft: '20px',
  },
}));

const AssetTreeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const AssetTableContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
`;
const CheckboxContainer = styled.div`
  .checkbox {
    padding: 0;
  }
`;
const HelpContainer = styled.div`
  margin-left: 5px;
`;
interface SelectionToggleProps {
  item: EventAssetType;
  selected: boolean;
  toggleSelected: (item: EventAssetType) => void;
}

const SelectionToggle = React.memo<SelectionToggleProps>(
  ({ item, selected, toggleSelected }) => {
    return (
      <CheckboxContainer>
        <Checkbox
          className="checkbox"
          checked={selected}
          onChange={() => toggleSelected(item)}
        />
      </CheckboxContainer>
    );
  }
);

SelectionToggle.displayName = 'SelectionToggle';

const helpTexts = {
  eventTrigger:
    'This is the asset type whose data triggers the event generation',
  eventLocation:
    'This is the asset type where you will find the event in the application, e.g., overheat on engine.',
  associatedAssets:
    'The data of these asset types will appear in the time-series charts on the event page',
};

export const EventForm = ({ eventType, setEventType, edit, setFormOpen }) => {
  const classes = useStyles();
  const {
    marathon,
    assetTypes,
    api: { getEventTypeApi },
  } = useMarathon();

  const [name, setName] = useState(edit ? eventType?.name : '');
  const [description, setDescription] = useState(
    edit ? eventType?.description : ''
  );
  const [severityOptions, setSeverityOptions] = useState([]);
  const [severity, setSeverity] = useState(edit ? eventType?.severityId : '');
  const [roles, setRoles] = useState(edit ? eventType?.visibleToRoles : []);
  const [isAlertStream, setIsAlertStream] = useState(
    edit ? eventType?.isAlertStream : false
  );
  const [eventLocation, setEventLocation] = useState([]);
  const [associatedAssetTypes, setAssociatedAssetTypes] = useState([]);
  const [eventTriggers, setEventTriggers] = useState([]);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const CODE_KEY = 'eventseverity';

  const { get, create, update } = getEventTypeApi();

  useEffect(() => {
    (async () => {
      if (edit) {
        const eventTypeFromApi = await get(eventType?.id);
        const primaryType = eventTypeFromApi?.assetTypes.find(
          (type) => type?.isPrimary === true
        );
        setEventLocation([primaryType].filter(r => r));
        setAssociatedAssetTypes(
          eventTypeFromApi?.assetTypes?.filter((type) => type.isPrimary === false) || []
        );
        setEventTriggers(eventTypeFromApi?.eventTriggers || []);
      }

      const severityData = marathon?.eventCodes.filter(
        (code) => code.codeType.name == CODE_KEY
      );
      setSeverityOptions(severityData);
    })()
  }, [])

  const onTreeChange = (assetType) => {

    if (assetType.id === eventLocation[0]?.assetTypeId) {
      setEventLocation([]);
    } else if (assetType.id !== eventLocation.assetTypeId) {
      setEventLocation([
        {
          assetTypeId: assetType.id,
          assetTypeName: assetType.name,
          isPrimary: true,
          isContributor: false,
          isLatestValue: false,
          assetTypeSlug: assetType.slug,
        }
      ]);
    }
  };

  const onEventTriggersChange = (assetType) => {

    if (assetType.id === eventTriggers[0]?.assetTypeId) {
      setEventTriggers([]);
    } else if (assetType.id !== eventTriggers.assetTypeId) {
      setEventTriggers([
        {
          assetTypeId: assetType.id,
          assetTypeName: assetType.name,
        },
      ]);
    }
  };

  const onMultiTreeChange = (assetType) => {
    if (
      !associatedAssetTypes?.find((type) => type.assetTypeId == assetType.id)
    ) {
      const a = {
        assetTypeId: assetType.id,
        assetTypeName: assetType.name,
        isPrimary: false,
        isContributor: false,
        isLatestValue: false,
        assetTypeSlug: assetType.slug,
      };
      setAssociatedAssetTypes([...associatedAssetTypes, a]);
    } else {
      setAssociatedAssetTypes((current) =>
        current.filter((item) => item.assetTypeId != assetType.id)
      );
    }
  };

  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const postData = {
      name: name,
      description: description,
      severityId: severity,
      eventSource: 'Model',
      visibleToRoles: roles,
      isAlertStream: isAlertStream,
      assetTypes: [...associatedAssetTypes, eventLocation[0]],
      eventTriggerAssetTypeIds: [eventTriggers[0]?.assetTypeId],
    };

    if (formValidation()) {
      setLoading(true);
      if (edit) {
        await update(eventType?.id, postData);
      } else {
        await create(postData);
      }
      // window.location.reload();
      marathon.refresh();
      setFormOpen(false);
    }
  };

  const formValidation = () => {
    let formValid = true;
    const errors = {};
    if (name === '') {
      formValid = false;
      errors['name'] = 'required';
    }
    if (description === '') {
      formValid = false;
      errors['description'] = 'required';
    }
    if (severity === '') {
      formValid = false;
      errors['severity'] = 'required';
    }
    if (eventLocation.length == 0) {
      formValid = false;
      errors['eventLocation'] = 'required';
    }
    if (associatedAssetTypes.length == 0) {
      formValid = false;
      errors['associatedAssetTypes'] = 'required';
    }
    if (eventTriggers.length == 0) {
      formValid = false;
      errors['eventTriggers'] = 'required';
    }
    setError(errors);
    return formValid;
  };

  const handleSeverity = (e) => {
    setSeverity(e.target.value);
  };

  const handleRoles = (e) => {
    setRoles(e.target.value);
  };

  const onCancel = () => {
    setEventType(null);
    setFormOpen(false);
  };

  const setLatestValue = (eventAssetType) => {
    setAssociatedAssetTypes((current) =>
      current.map((type) => {
        if (type.assetTypeId == eventAssetType.assetTypeId) {
          return { ...type, isLatestValue: !type.isLatestValue };
        }
        return type;
      })
    );
  };

  const removeAssociatedAsset = (assetType) => {
    setAssociatedAssetTypes((current) =>
      current.filter((item) => item.assetTypeId != assetType.assetTypeId)
    );
  };

  const roots =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (assetTypes.byParent[undefined] || []).sort(ascBy('name'));
  return (
    <FormWrapper
      title={edit ? 'Edit Event Type' : 'Create Event Type'}
      saveButtonName={edit ? 'Save' : 'Create'}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
    >
      <MuiThemeProvider theme={formLabelsTheme}>
        <Grid container spacing={6}>
          <InputLabel className={classes.inputDescription}>
            <AsteriskColorSpan>*</AsteriskColorSpan>
            Indicates required fields
          </InputLabel>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              Name <AsteriskColorSpan>*</AsteriskColorSpan>{' '}
            </InputLabel>
            <TextField
              error={error?.name ? true : false}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError({ ...error, name: '' });
              }}
              helperText={error?.name}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              Description <AsteriskColorSpan>*</AsteriskColorSpan>
            </InputLabel>
            <TextField
              error={error?.description ? true : false}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError({ ...error, description: '' });
              }}
              required
              fullWidth
              helperText={error?.description}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              Severity <AsteriskColorSpan>*</AsteriskColorSpan>{' '}
            </InputLabel>
            <SeveritySelectInput
              value={severity}
              options={severityOptions}
              object={true}
              valueField={'id'}
              handleChange={handleSeverity}
              required
              error={error?.severity ? true : false}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>Visibility</InputLabel>
            <SelectInput
              value={roles}
              options={marathon.eventRolesList}
              multiple={true}
              handleChange={handleRoles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              Visibility in Alert Stream
            </InputLabel>
            <SwitchForVisibility
              onChange={() => setIsAlertStream(!isAlertStream)}
              checked={isAlertStream}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}></InputLabel>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              Asset Type <AsteriskColorSpan>*</AsteriskColorSpan>
            </InputLabel>
            <AssetTreeContainer>
              <InputLabel className={classes.inputLabel}>
                Trigger Asset
                <AsteriskColorSpan>*</AsteriskColorSpan>
                <Tooltip title={helpTexts.eventTrigger} arrow>
                  <HelpContainer>
                    <HelpIcon />
                  </HelpContainer>
                </Tooltip>
              </InputLabel>
              <TreeSelect
                roots={roots}
                values={eventTriggers}
                onTreeChange={onEventTriggersChange}
                multi={false}
                error={error?.eventTriggers ? true : false}
              />
            </AssetTreeContainer>
            <AssetTreeContainer>
              <InputLabel className={classes.inputLabel}>
                Event Location
                <AsteriskColorSpan>*</AsteriskColorSpan>
                <Tooltip title={helpTexts.eventLocation} arrow>
                  <HelpContainer>
                    <HelpIcon />
                  </HelpContainer>
                </Tooltip>
              </InputLabel>
              <TreeSelect
                roots={roots}
                values={eventLocation}
                onTreeChange={onTreeChange}
                multi={false}
                error={error?.eventLocation ? true : false}
              />
            </AssetTreeContainer>
            <AssetTreeContainer>
              <InputLabel className={classes.inputLabel}>
                Associated Assets
                <AsteriskColorSpan>*</AsteriskColorSpan>
                <Tooltip title={helpTexts.associatedAssets} arrow>
                  <HelpContainer>
                    <HelpIcon />
                  </HelpContainer>
                </Tooltip>
              </InputLabel>
              <TreeSelect
                roots={roots}
                values={associatedAssetTypes}
                onTreeChange={onMultiTreeChange}
                multi={true}
                error={error?.associatedAssetTypes ? true : false}
              />
            </AssetTreeContainer>
            <AssetTableContainer>
              {associatedAssetTypes.length > 0 && (
                <FastDataTable<EventAssetType>
                  columns={[
                    {
                      title: 'Name',
                      getValue: (assetType) => assetType?.assetTypeName,
                    },
                    {
                      title: 'Latest Value',
                      getValue: (assetType) => assetType?.assetTypeId,
                      // eslint-disable-next-line react/display-name
                      render: (assetType) => (
                        <SelectionToggle
                          item={assetType}
                          selected={assetType?.isLatestValue}
                          toggleSelected={setLatestValue}
                        />
                      ),
                      columnStyles: `
                        width: 240px;
                      `,
                    },
                    {
                      title: 'Action',

                      getValue: (assetType) => assetType?.assetTypeId,
                      // eslint-disable-next-line react/display-name
                      render: (assetType) => (
                        <IconButton
                          onClick={() => removeAssociatedAsset(assetType)}
                          icon={RemoveIcon}
                        />
                      ),
                    },
                  ]}
                  items={associatedAssetTypes}
                  rowCursor={false}
                />
              )}
            </AssetTableContainer>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    </FormWrapper>
  );
};
