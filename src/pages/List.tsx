
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
   DataGrid, 
   GridColDef, 
   GridValueGetterParams,
   GridRowParams,
   GridActionsCellItem, 
   GridToolbarContainer,
   GridRowModesModel,
   GridRowModes
  } from '@mui/x-data-grid';

export const List = () => {
  
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page:0
  });
  const [posts, setPosts] = useState([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  async function listPosts() {
    const posts:any = await invoke("list_posts_in_page", paginationModel);
    setPosts(JSON.parse(posts));
   }

  useEffect(() => {
     listPosts();
  }, [paginationModel]);

  // const onRowEditStop = async ({row}:GridRowParams)=>{

  //   await invoke("update_post", row)
  // }

  // const processRowUpdate = async (updatedRow:any)=>{
  //   await invoke("update_post", updatedRow)
  // }

  const handleDeleteClick = (params: GridRowParams) => async () => {
    await invoke("delete_post", { id: params.id });
    await listPosts();
  };

  const handleEditClick = (params: GridRowParams) => () => {
    setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (params: any) => async () => {
  
    await invoke("update_post", params.row)
    setRowModesModel({
      ...rowModesModel,
      [params.id]: { mode: GridRowModes.View},
    });
  };

  const handleCancelClick = (params: GridRowParams) => () => {
    setRowModesModel({
      ...rowModesModel,
      [params.id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  }
  
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', type: 'number', width: 70 },
    { field: 'title', headerName: 'Title',  type: 'string', width: 130, editable: true },
    { field: 'text', headerName: 'Text', type: 'text', width: 130, editable: true },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.id || ''} ${params.row.title || ''}`,
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (params: GridRowParams) => {
        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(params)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(params)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(params)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(params)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  
  function toolbar(props: any) {
    const handleClick = async() => {
      await invoke("create_post", { title: 'title',  text:'lorem text' });
      await listPosts();
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary"  onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }
  

  return (
    <Paper>
      <p>{JSON.stringify(rowModesModel)}</p>
    <DataGrid
         initialState={{
          pagination: {
            paginationModel,
          },
        }}
        rows={posts}
        columns={columns}
        density="comfortable"
        editMode="row"
        rowModesModel={rowModesModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10]}
        slots={{
          toolbar,
        }}
    />
    </Paper>
  );
};