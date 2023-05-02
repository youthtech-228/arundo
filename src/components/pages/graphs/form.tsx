import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { TextField, createTheme } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import { FormWrapper } from '~/components/misc/formWrapper';
import { Chip } from '~/components/misc/groupChip';
import { useMarathon } from '~/contexts/marathonContext';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { AsteriskColorSpan } from '~/components/misc/icons';
import { FileUploader } from '~/components/misc/fileUploader';
import { ModalContent } from '~/components/misc/imagePreviewer';
import { TreeSelect } from '~/components/misc/treeSelect';
import { FormControlCustom } from '~/components/misc/formControl';
import { ascBy, sortByName} from '~/utils';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { success } from '~/services/messages';

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
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  groupLabel: {
    color: 'black',
    marginBottom: '40px',
  },
  inputDescription: {
    marginBottom: '0px',
    width: '100%',
    marginLeft: '20px',
  },
  bacgroundImg: {
    marginLeft: '20px',
    marginTop: '10px'
  }
}));

const AxisContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const AxisInput = styled.div`
  padding: 0 10px 0 0;
`

export const Form = ({ graphType, edit, setFormOpen, setSelectedGraphType }) => {
  const {
    assetTypes,
    assets,
    units,
    tagTypes,
    api: { getGraphTypeApi, getGraphImageApi },
    marathon,
  } = useMarathon();

  const classes = useStyles();
  const [name, setName] = useState(edit ? graphType?.name : '');
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [xAxisAssetType, setXAxisAssetType] = useState([]);
  const [xAxisAssetTypeList, setXAxisAssetTypeList] = useState([]);
  const [yAxisAssetTypeList, setYAxisAssetTypeList] = useState([]);
  const [yAxisAssetType, setYAxisAssetType] = useState([]);
  const [primaryAssetType, setPrimaryAssetType] = useState([]);
  const [assetGraphTypes, setAssetGraphTypes] = useState([]);
  const [xAxisMax, setXAxisMax] = useState(edit ? graphType.xAxisMax : null);
  const [yAxisMax, setYAxisMax] = useState(edit ? graphType.yAxisMax : null);
  const [xAxisMin, setXAxisMin] = useState(edit ? graphType.xAxisMin : null);
  const [yAxisMin, setYAxisMin] = useState(edit ? graphType.yAxisMin : null);
  const [xAxisUnit, setXAxisUnit] = useState(edit ? graphType.xAxisUnit : '');
  const [yAxisUnit, setYAxisUnit] = useState(edit ? graphType.yAxisUnit : '');
  const [xAxisUnits, setXAxisUnits] = useState([]);
  const [yAxisUnits, setYAxisUnits] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const filterUnits = (assetType) => {
    if (units) {
      const tagType = tagTypes.find((t) => t?.assetTypeId == assetType?.id);    
      const tagTypeUnit = units.find((u) => u?.name == tagType?.unit);
      return tagTypeUnit ? units.filter((u) => u?.dimension == tagTypeUnit?.dimension) : [];
    }
    return [];
  };
  useEffect(() => {
    (async () => {
      if (edit) {
        const { list } = getGraphImageApi();
        const graphImages = await list();
        const graphImage = graphImages.find(img => img.id === graphType.graphImageId);
        const xAxisAssetTypeData = assetTypes.find(row => row.id == graphType.xAxisAssetTypeId);
        const yAxisAssetTypeData = assetTypes.find(row => row.id == graphType.yAxisAssetTypeId);
        const primaryAssetTypeData = assetTypes.find(row => row.id == graphType.primaryAssetTypeId);
        setXAxisAssetType([{
          assetTypeId: graphType.xAxisAssetTypeId,
          assetTypeName: xAxisAssetTypeData.name
        }]);

        setXAxisUnits(filterUnits(xAxisAssetTypeData));
        
        setYAxisAssetType([{
          assetTypeId: graphType.yAxisAssetTypeId,
          assetTypeName: yAxisAssetTypeData.name
        }]);

        setYAxisUnits(filterUnits(yAxisAssetTypeData));
        setPrimaryAssetType([{
          assetTypeId: graphType.primaryAssetTypeId,
          assetTypeName: primaryAssetTypeData.name
        }]);
        
        let originAssets = [];
        graphType.assetGraphTypes.map(row => {
          assets.map(asset => {
            if(row.primaryAssetId === asset.id){
              originAssets.push({
                assetTypeId: asset.id,
                assetTypeName: asset.name
              });
            }
          });
        });
        setAssetGraphTypes(originAssets);
        setBackgroundImg(graphImage);
      }
    })()
  }, []);

  const formValidation = () => {
    let formValid = true;
    const errors = {};
    if (name === '') {
      formValid = false;
      errors['name'] = 'required';
    }
    if (backgroundImg == null) {
      formValid = false;
      errors['backgroundImg'] = 'required';
    }
    if (xAxisAssetType.length < 1) {
      formValid = false;
      errors['xAxisAssetType'] = 'required';
    }
    if (yAxisAssetType.length < 1) {
      formValid = false;
      errors['yAxisAssetType'] = 'required';
    }
    if (yAxisMax == null) {
      formValid = false;
      errors['yAxisMax'] = 'required';
    }
    if (yAxisMin == null) {
      formValid = false;
      errors['yAxisMin'] = 'required';
    }
    if (yAxisUnit == '') {
      formValid = false;
      errors['yAxisUnit'] = 'required';
    }
    if (xAxisMax == null) {
      formValid = false;
      errors['xAxisMax'] = 'required';
    }
    if (xAxisMin == null) {
      formValid = false;
      errors['xAxisMin'] = 'required';
    }
    if (xAxisUnit == '') {
      formValid = false;
      errors['xAxisUnit'] = 'required';
    }
    if (primaryAssetType.length < 1) {
      formValid = false;
      errors['primaryAssetType'] = 'required';
    }
    if (assetGraphTypes.length < 1) {
      formValid = false;
      errors['assetGraphTypes'] = 'required';
    }
    setError(errors);
    return formValid;
  };
  
  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { create, update } = getGraphTypeApi();    
     
    if (formValidation()) {
      setLoading(true);
      const postGroup = {
        name: name,
        graphCategoryId: "ffffffff-ffff-ffff-ffff-ffffffffffff",
        primaryAssetTypeId: primaryAssetType[0].assetTypeId,
        graphImageId: backgroundImg.id,
        xAxisAssetTypeId: xAxisAssetType[0].assetTypeId,
        yAxisAssetTypeId: yAxisAssetType[0].assetTypeId,
        xAxisUnit: xAxisUnit,
        yAxisUnit: yAxisUnit,
        xAxisMin: xAxisMin,
        xAxisMax: xAxisMax,
        yAxisMin: yAxisMin,
        yAxisMax: yAxisMax,
        organizationId: "6710c0b4-7314-46ed-b737-4b0954825828",
        assetIds: assetGraphTypes.map(row => { return row.assetTypeId})
    }
      if (!edit) {
        await create(postGroup, window.location.href);
      } else {
        await update(graphType?.id, postGroup);
        success('successfully saved !');
        // window.location.reload();        
      }

      marathon.refresh();
      setFormOpen(false);
    }
  };

  const imageUpload = async event => {
    const { upload, get } = getGraphImageApi();
    const file: Blob = event.target.files[0]
      const formData = new FormData();
      formData.append('file', file);
      const res = await upload(formData, event.target.files[0].name);
      setBackgroundImg(res);
  };

  const onCancel = () => {
    setSelectedGraphType(null);
    setFormOpen(false);
  };

  const onXAxisTreeChange = (assetType) => {

    if (assetType.id === xAxisAssetType[0]?.assetTypeId) {
      setXAxisAssetType([]);
    } else {
      setXAxisAssetType([
        {
          assetTypeId: assetType.id,
          assetTypeName: assetType.name,
        }
      ]);
      setXAxisUnits(filterUnits(assetType));
    }
  };

  const onYAxisTreeChange = (assetType) => {

    if (assetType.id === yAxisAssetType[0]?.assetTypeId) {
      setYAxisAssetType([]);
    } else {
      setYAxisAssetType([
        {
          assetTypeId: assetType.id,
          assetTypeName: assetType.name,
        }
      ]);
      setYAxisUnits(filterUnits(assetType));
    }
  };

  const onPrimaryAssetTypeTreeChange = (assetType) => {
    if (assetType.id === primaryAssetType[0]?.assetTypeId) {
      setPrimaryAssetType([]);
      setXAxisAssetTypeList([]);
      setYAxisAssetTypeList([]);
      setXAxisAssetType([]);
      setYAxisAssetType([]);
    } else {
      setPrimaryAssetType([
        {
          assetTypeId: assetType.id,
          assetTypeName: assetType.name,
        }
      ]);
      let roots = (assetTypes.byParent[assetType.id] || []).sort(ascBy('name'));
      setXAxisAssetTypeList(roots);
      setYAxisAssetTypeList(roots);
      setXAxisAssetType([]);
      setYAxisAssetType([]);
    }
  };

  const onAssetGraphTypesTreeChange = (asset) => {
    if (
      !assetGraphTypes?.find((type) => type.assetTypeId == asset.id)
    ) {
      const a = {
        assetTypeId: asset.id,
        assetTypeName: asset.name,
      };
      setAssetGraphTypes([...assetGraphTypes, a]);
    } else {
      setAssetGraphTypes((current) =>
        current.filter((item) => item.assetTypeId != asset.id)
      );
    }
  };

  const onAssetGraphTypeDelete = (asset) => {
    setAssetGraphTypes((current) =>
      current.filter((item) => item.assetTypeId != asset.assetTypeId)
    );    
  };

  const roots = (assetTypes.byParent[undefined] || []).sort(ascBy('name'));
  var assetsRoots = [];
  if ( primaryAssetType.length > 0 ) {
    assetsRoots = (assets.withType[primaryAssetType[0]?.assetTypeId] || []).sort(ascBy('name'));
  }

  return (
    <FormWrapper
      title={edit ? 'Edit Graph Type' : 'Create Graph Type'}
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
              Background Image <AsteriskColorSpan>*</AsteriskColorSpan>{' '}
            </InputLabel>
            <FileUploader imageUpload={imageUpload} />
             {
              backgroundImg ? <Chip                 
                lock={false}
                src={backgroundImg?.uri}
                onDelete={() => setBackgroundImg(null)}
                onClick={() => setIsPreviewOpen(true)}
                className={classes.bacgroundImg}
              > 
                {backgroundImg?.name} 
              </Chip> : <></>
             }
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              Show this graph under asset type <AsteriskColorSpan>*</AsteriskColorSpan>{' '}
            </InputLabel>
            <TreeSelect
              roots={roots}
              values={primaryAssetType}
              onTreeChange={onPrimaryAssetTypeTreeChange}
              multi={false}
              error={error?.primaryAssetType ? true : false}
              width={'100%'}
              placeholder={'Choose an asset type'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              Show this graph under asset instance<AsteriskColorSpan>*</AsteriskColorSpan>{' '}
            </InputLabel>
            <TreeSelect
              roots={assetsRoots}
              values={assetGraphTypes}
              onTreeChange={onAssetGraphTypesTreeChange}
              multi={true}
              error={error?.assetGraphTypes ? true : false}
              width={'100%'}
              placeholder={'Search asset instance'}
            />
            {
              assetGraphTypes.map((row, index) => 
                <Chip    
                  key={index}             
                  lock={false}
                  onDelete={() => onAssetGraphTypeDelete(row)}
                  className={classes.bacgroundImg}
                > 
                  {row?.assetTypeName} 
                </Chip>
              )
            }
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              X-axis <AsteriskColorSpan>*</AsteriskColorSpan>{' '}
            </InputLabel>
            <AxisContainer>
              <AxisInput>
                <TreeSelect
                  roots={xAxisAssetTypeList}
                  values={xAxisAssetType}
                  onTreeChange={onXAxisTreeChange}
                  multi={false}
                  error={error?.xAxisAssetType ? true : false}
                  width={'300px'}
                  placeholder={'Choose an asset type'}
                />
              </AxisInput>
              <AxisInput>
                <TextField
                  value={xAxisMin}
                  onChange={(e) => {
                    setXAxisMin(e.target.value);
                  }}
                  required
                  error={error?.xAxisMin}
                  fullWidth
                  placeholder='Min'
                  type={'number'}
                />
              </AxisInput>
              <AxisInput>
                <TextField
                  value={xAxisMax}
                  onChange={(e) => {
                    setXAxisMax(e.target.value);
                  }}
                  placeholder='Max'
                  required
                  error={error?.xAxisMax}
                  fullWidth
                  type={'number'}
                />
              </AxisInput>
              <FormControlCustom>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="xAxisUnit"
                  placeholder={'Unit'}
                  onChange={(e) => setXAxisUnit(e.target.value)}
                  value={xAxisUnit}
                  required
                  
                >
                  {
                    xAxisUnits
                      .sort(sortByName)
                      .map((row, index) => (
                        <MenuItem key={index} value={row.name}>
                          {row.name == '' ? 'None' : row.name}
                        </MenuItem>
                      ))
                  }
                </Select>
              </FormControlCustom>    
            </AxisContainer>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              Y-axis <AsteriskColorSpan>*</AsteriskColorSpan>{' '}
            </InputLabel>
            <AxisContainer>
              <AxisInput>
                <TreeSelect
                  roots={yAxisAssetTypeList}
                  values={yAxisAssetType}
                  onTreeChange={onYAxisTreeChange}
                  multi={false}
                  error={error?.yAxisAssetType ? true : false}
                  width={'300px'}
                  placeholder={'Choose an asset type'}
                />
              </AxisInput>
              <AxisInput>
                <TextField
                  value={yAxisMin}
                  onChange={(e) => {
                    setYAxisMin(e.target.value);
                  }}
                  required
                  error={error?.yAxisMin}
                  fullWidth
                  placeholder='Min'
                  type={'number'}
                />
              </AxisInput>
              <AxisInput>
                <TextField
                  value={yAxisMax}
                  onChange={(e) => {
                    setYAxisMax(e.target.value);
                  }}
                  placeholder='Max'
                  required
                  error={error?.yAxisMax}
                  fullWidth
                  type={'number'}
                />
              </AxisInput> 
              <FormControlCustom>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="yAxisUnit"
                  placeholder={'Unit'}
                  onChange={(e) => setYAxisUnit(e.target.value)}
                  value={yAxisUnit}
                  required
                >
                  {
                    yAxisUnits
                      .sort(sortByName)
                      .map((row, index) => (
                        <MenuItem key={index} value={row.name}>
                          {row.name == '' ? 'None' : row.name}
                        </MenuItem>
                      ))
                  }
                </Select>
              </FormControlCustom>              
            </AxisContainer>
          </Grid>
        </Grid>
        {isPreviewOpen && (
          <ModalContent onClose={() => setIsPreviewOpen(false)}>
            <img src={backgroundImg?.uri} alt="" />
          </ModalContent>
        )}
      </MuiThemeProvider>      
    </FormWrapper>
  );
};
