import {
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Link,
  Breadcrumbs,
  Box,
  LinearProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Card,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { GitRepositoryInterface, GithubCred } from "../interface/gitRepository.interface";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import GitHubIcon from '@mui/icons-material/GitHub';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

import { Editor } from "@monaco-editor/react";

function getPathHierarchy(inputString: string) {
  const segments = inputString.split('/');
  return segments.map((segment, index) => {
    const name = segment;
    const path = segments.slice(0, index).join('/');
    return { name, path };
  }).filter(segment => segment.name !== '');
}

const DashboardPage: React.FC = () => {
  const [openGitCredDialog, setGitModalStatus] = useState<boolean>(true)
  const [githubCred, handleGitHubCred] = useState<GithubCred>({ owner: '', apiKey: '', repository: '' })

  const setGithubCred = () => {
    try {
      // localStorage.setItem('GITHUB_CRED', JSON.stringify(githubCred))
      handleGitHubCred(prev => { return { ...prev, settingCred: true } })
      fetch('/api/setGithubConfig', {
        method: 'POST',
        body: JSON.stringify({
          owner: githubCred.owner,
          apiKey: githubCred.apiKey,
          repository: githubCred.repository,
        }),
      }).then(res => {
        handleGitHubCred(prev => { return { ...prev, settingCred: false } })
        setGitModalStatus(false)
        setBreadCrumb(prev => [...prev])
        getGithubRepository()

      })
    }
    catch (error: Error | any) {
      return (
        <Alert severity="error">
          {error.message}
        </Alert>)
    }

  }

  useEffect(() => {
    const localGithubCred: any = localStorage.removeItem('GITHUB_CRED')
    if (localGithubCred) {
      handleGitHubCred({ ...JSON.parse(localGithubCred), settingCred: false });
      setBreadCrumb((prev: any) => [...prev])
      setGitModalStatus(false)
    }
  }, []);


  const [folders, setFolders] = useState<GitRepositoryInterface[]>([]);
  const [loadingRepository, setLoadRepository] = useState(false)
  const [breadCrumb, setBreadCrumb] = useState<{ name: string, path: string }[]>([]);
  const [currPath, setCurrPath] = useState<string>();

  useEffect(() => {
    const path: string = currPath || ''
    setBreadCrumb([...getPathHierarchy(path + '/')])
    setLoadRepository(true)
    getGithubRepository(path)
  }, [currPath])

  const getGithubRepository = async (path: string = '') => {
    try {
      const response = await fetch(`/api/getRepo?path=${path}`);
      const data = await response.json();
      setLoadRepository(false)

      if (data && data.length) {
        data.sort((a: GitRepositoryInterface, b: GitRepositoryInterface) =>
          a.type.localeCompare(b.type)
        )
      }
      setFolders(data);

    } catch (error: any) {
      return (
        <Alert severity="error">
          {error.message}
        </Alert>)
    }
  }


  const [openDeleteFileModal, setDeleteFileStatus] = useState(false)
  const [deleteFileData, setDeleteFileData] = useState<{ path: string, sha: string, message: string }>({ path: '', sha: '', message: '' })

  const onDeleteFile = async () => {
    const { path, sha, message } = deleteFileData
    try {
      const response = await fetch(
        `/api/deleteRepoFile`, {
        method: 'POST',
        body: JSON.stringify({ path, sha, message })
      })
      await response.json();
      setDeleteFileData({ path: '', sha: '', message: '' })
      setDeleteFileStatus(false)
      getGithubRepository(currPath)
    } catch (error: Error | any) {
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>)
    }
  };

  const [codeEditorOpen, setCodeEditionOpenStatus] = useState<boolean>(false)
  const [codeData, setCodeData] = useState<any>('')
  const [currentCodeFile, setCurrentCodeFile] = useState<GitRepositoryInterface>()

  const getFileData = async (path: string) => {
    try {
      setLoadRepository(true)
      const response = await fetch(`/api/getRepo?path=${path}`);
      const data = await response.json();
      setCurrentCodeFile(data)
      setLoadRepository(false)
      if (data) {
        setCodeEditionOpenStatus(true)
        const code = (atob(data.content))
        setCodeData(code)
      }
    } catch (error: Error | any) {
      console.log(error)
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>)
    }
  }


  const [updateFileData, setUpdateFileData] = useState<{ path: string, sha: string, message: string, code: string }>({ path: '', sha: '', message: '', code: '' })
  const [openUpdateCommitModal, setOpenUpdateCommitModalStatus] = useState<boolean>(false)
  const onUpdateFile = async () => {
    let { path, sha, message, code } = updateFileData
    code = btoa(code)
    try {
      const response = await fetch(
        `/api/updateRepoFile`, {
        method: 'POST',
        body: JSON.stringify({ path, sha, message, code })
      })
      const data = await response.json();
      setUpdateFileData({ path: '', sha: '', message: '', code: '' })
      setOpenUpdateCommitModalStatus(false)
      setCodeEditionOpenStatus(false)
      if (response.status !== 200) {
        return (
          <Alert severity="error">
            {data}
          </Alert>)
      }
    } catch (error: Error | any) {

    }
  }


  const onLogout = async () => {
    localStorage.removeItem('GITHUB_CRED')
    handleGitHubCred({ owner: '', repository: '', apiKey: '' })
    setFolders([])
    setBreadCrumb([])
    setCurrPath('')
    setGitModalStatus(true)
    let data = await fetch('/api/onLogout')
    await data.json();

  }

  return (
    <div>

      <Dialog open={openGitCredDialog} onClose={(e, reason) => {
        if (reason && reason == "backdropClick")
          return;
        setGitModalStatus(false)
      }} >
        <DialogTitle>Git Hub</DialogTitle>
        <DialogContent >
          <DialogContentText>
            Please Insert GitHub Details
          </DialogContentText>
          <br />
          <Box >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth={true} label="Owner" type="text" value={githubCred.owner} variant="standard" onChange={(e) => {
                  handleGitHubCred((prev) => { return { ...prev, owner: e.target.value } })
                }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth={true} label="API Key" type="password" value={githubCred.apiKey} variant="standard" onChange={(e) => {
                  handleGitHubCred((prev) => { return { ...prev, apiKey: e.target.value } })
                }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth={true} label="Repository" type="text" value={githubCred.repository} variant="standard" onChange={(e) => {
                  handleGitHubCred((prev) => { return { ...prev, repository: e.target.value } })
                }} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          {/* {(() => githubCred.settingCred ? <CircularProgress /> : '')()} */}
          &nbsp;&nbsp;
          <Button variant="contained" disabled={githubCred.settingCred} onClick={() => {
            setGithubCred()
          }}>Get Repository</Button>
        </DialogActions>
      </Dialog>

      {(githubCred.apiKey && githubCred.owner && githubCred.repository && folders.length) ?
        (<div>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <GitHubIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {githubCred.repository}
              </Typography>

              <Typography variant="h6" component="div" align="right" >
                {githubCred.owner}
              </Typography>
              <IconButton onClick={() => onLogout()} color="inherit">
                <LogoutIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box sx={{ width: '100%' }}>
            {(() => loadingRepository ? <LinearProgress /> : '')()}
          </Box>
          <Box sx={{
            margin: '0.25rem',
            height: '40px'
          }}>
            <Card style={{ height: '100%', margin: '0.25rem', paddingLeft: '1rem', padding: '0.25rem' }}>
              <Breadcrumbs aria-label="breadcrumb">
                {breadCrumb && breadCrumb.map((b: { name: string, path: string }) => {
                  return (
                    <Link
                      key={b.name}
                      underline="hover"
                      color="inherit"
                      fontSize="20px"
                      onClick={() => {
                        setCurrPath(b.path);
                      }}
                    >
                      {b.name}
                    </Link>
                  );
                })}
              </Breadcrumbs>
            </Card>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {folders &&
                  folders.map((file) => {
                    return (
                      <TableRow key={file.name}>
                        <TableCell>
                          {file.type === "file" ? (
                            <InsertDriveFileIcon color="info" />
                          ) : (
                            <FolderIcon color="warning" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography style={{ cursor: 'pointer' }} variant="body1" display="block" onClick={() => {
                            if (file.type === "dir") {
                              setCurrPath(file.path)
                            } else {
                              setUpdateFileData(prev => { return { ...prev, path: file.path, sha: file.sha } })
                              getFileData(file.path)
                            }
                          }
                          }> {file.name}</Typography>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            if (file.type === "file") {
                              return (<IconButton
                                onClick={() => {
                                  setDeleteFileData((prev => { return { ...prev, path: file.path, sha: file.sha } }))
                                  setDeleteFileStatus(true)
                                }}>
                                <DeleteIcon />
                              </IconButton>)
                            }
                          })()}

                        </TableCell>



                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>



          <Dialog open={openDeleteFileModal} onClose={(e, reason) => {
            if (reason && reason == "backdropClick")
              return;
            setDeleteFileStatus(false)
          }} >
            <DialogTitle>Delete File</DialogTitle>
            <DialogContent >
              <DialogContentText>
                Commit Message
              </DialogContentText>
              <br />
              <Box >
                <TextField label="message" value={deleteFileData.message} onChange={(e) => {
                  setDeleteFileData((prev => { return { ...prev, message: e.target.value } }))
                }} error={!deleteFileData.message}></TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button color="info" onClick={() => {
                setDeleteFileData({ path: '', sha: '', message: '' })
                setDeleteFileStatus(false)
              }}>Cancel</Button>
              <Button color="error" variant="contained" disabled={!deleteFileData.message} onClick={() => {
                onDeleteFile()
              }}>Delete</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={codeEditorOpen} fullScreen={true}>
            <DialogTitle sx={{ height: '40px' }}>
              {currentCodeFile && currentCodeFile.name}
              {codeEditorOpen ? (
                <IconButton
                  aria-label="close"
                  onClick={() => setCodeEditionOpenStatus(false)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              ) : null}
            </DialogTitle>
            <Box sx={{
              height: '100%',
            }}>
              <DialogContent sx={{
                height: '100%',
                paddingLeft: '0',
                paddingRight: '0',
              }}>
                <Editor
                  height="100%"
                  width="100%"
                  defaultLanguage="javascript"
                  defaultValue={codeData}
                  onChange={(e) => {
                    setUpdateFileData((prev: any) => { return { ...prev, code: e } })
                  }}
                  theme="vs-dark"
                />
              </DialogContent>
            </Box>
            <DialogActions>
              <Button variant="outlined" color="error" onClick={() => {
                setUpdateFileData({ path: '', sha: '', message: '', code: '' })
                setCodeEditionOpenStatus(false)
              }}>Cancel</Button>
              <Button variant="contained" color="info" onClick={() => setOpenUpdateCommitModalStatus(true)}>Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openUpdateCommitModal} onClose={(e, reason) => {
            if (reason && reason == "backdropClick")
              return;
            setOpenUpdateCommitModalStatus(false)
          }} >
            <DialogTitle>Update File</DialogTitle>
            <DialogContent >
              <DialogContentText>
                Commit Message
              </DialogContentText>
              <br />
              <Box >
                <TextField label="message" value={updateFileData.message} onChange={(e) => {
                  setUpdateFileData((prev => { return { ...prev, message: e.target.value } }))
                }} error={!updateFileData.message}></TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button color="error" onClick={() => {
                setOpenUpdateCommitModalStatus(false)
              }}>Cancel</Button>
              <Button color="info" variant="contained" disabled={!updateFileData.message} onClick={() => {
                onUpdateFile()
              }}>Update</Button>
            </DialogActions>
          </Dialog>

        </div >
        ) : ''
      }
    </div >
  );
};

export default DashboardPage;
