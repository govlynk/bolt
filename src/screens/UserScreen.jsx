import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { UserDialog } from '../components/UserDialog';
import { ContactSelectionDialog } from '../components/user/ContactSelectionDialog';
import { UserCreationDialog } from '../components/user/UserCreationDialog';
import { ContactCreationDialog } from '../components/user/ContactCreationDialog';

export default function UserScreen() {
  const { users, fetchUsers, removeUser, loading, error, cleanup } = useUserStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contactSelectionOpen, setContactSelectionOpen] = useState(false);
  const [contactCreationOpen, setContactCreationOpen] = useState(false);
  const [userCreationOpen, setUserCreationOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchUsers();
    return () => cleanup();
  }, [fetchUsers, cleanup]);

  const handleAddClick = () => {
    setContactSelectionOpen(true);
  };

  const handleContactSelected = (contact) => {
    setContactSelectionOpen(false);
    if (contact) {
      setSelectedContact(contact);
      setUserCreationOpen(true);
    } else {
      setContactCreationOpen(true);
    }
  };

  const handleContactCreated = (newContact) => {
    setContactCreationOpen(false);
    setSelectedContact(newContact);
    setUserCreationOpen(true);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeleteLoading(true);
      setDeleteError(null);
      try {
        await removeUser(userId);
      } catch (err) {
        console.error('Error deleting user:', err);
        setDeleteError('Failed to delete user. Please try again.');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Users</Typography>
        <Button
          variant="contained"
          startIcon={<UserPlus size={20} />}
          onClick={handleAddClick}
        >
          Add User
        </Button>
      </Box>

      {(error || deleteError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || deleteError}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === 'ACTIVE' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleEditClick(user)}
                    size="small"
                    title="Edit User"
                    disabled={deleteLoading}
                  >
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(user.id)}
                    size="small"
                    color="error"
                    title="Delete User"
                    disabled={deleteLoading}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {(!users || users.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ContactSelectionDialog
        open={contactSelectionOpen}
        onClose={() => setContactSelectionOpen(false)}
        onContactSelected={handleContactSelected}
      />

      <ContactCreationDialog
        open={contactCreationOpen}
        onClose={() => setContactCreationOpen(false)}
        onContactCreated={handleContactCreated}
      />

      <UserCreationDialog
        open={userCreationOpen}
        onClose={() => {
          setUserCreationOpen(false);
          setSelectedContact(null);
        }}
        contactData={selectedContact}
      />

      <UserDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditUser(null);
        }}
        editUser={editUser}
      />
    </Box>
  );
}