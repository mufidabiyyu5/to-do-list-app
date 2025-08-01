import {
    Box,
    Heading,
    VStack,
    HStack,
    Input,
    Button,
    Text,
    IconButton,
    useToast,
    Divider,
    Checkbox,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import {
    fetchChecklists,
    createChecklist,
    deleteChecklist,
    fetchChecklistItems,
    addItemToChecklist,
    toggleChecklistItemStatus,
    deleteChecklistItem,
} from '../api/checklist';
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
    const [checklists, setChecklists] = useState([]);
    const [itemsMap, setItemsMap] = useState({});
    const [newChecklistName, setNewChecklistName] = useState('');
    const [newItemText, setNewItemText] = useState({});
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        loadChecklists();
    }, []);

    const loadChecklists = async () => {
        try {
            const res = await fetchChecklists();
            const checklistArray = res.data.data;
            setChecklists(checklistArray);

            const itemsByChecklist = {};

            for (const checklist of checklistArray) {
            const checklistId = checklist.id || checklist.checklistId;
            try {
                const itemRes = await fetchChecklistItems(checklistId);
                itemsByChecklist[checklistId] = itemRes.data.data;
            } catch (err) {
                console.error(`Gagal fetch item untuk checklist ${checklistId}:`, err);
                itemsByChecklist[checklistId] = [];
            }
            }

            setItemsMap(itemsByChecklist);
        } catch (err) {
            console.error("Gagal fetch checklist:", err);
            toast({ title: 'Gagal memuat checklist', status: 'error' });
        }
    };

    const handleCreateChecklist = async () => {
        if (!newChecklistName.trim()) return;
        try {
        const res = await createChecklist(newChecklistName);
        window.location.reload();
        toast({ title: 'Berhasil membuat checklist', status: 'success' });
        } catch {
        toast({ title: 'Gagal membuat checklist', status: 'error' });
        }
    };

    const handleAddItem = async (checklistId) => {
        const text = newItemText[checklistId];
        if (!text?.trim()) return;
        try {
        const res = await addItemToChecklist(checklistId, text);
        setItemsMap(prev => ({
            ...prev,
            [checklistId]: [...(prev[checklistId] || []), res.data.data],
        }));
        setNewItemText({ ...newItemText, [checklistId]: '' });
        } catch {
        toast({ title: 'Gagal menambahkan item', status: 'error' });
        }
    };

    const handleToggleItem = async (checklistId, itemId) => {
        try {
        await toggleChecklistItemStatus(checklistId, itemId);
        setItemsMap(prev => ({
            ...prev,
            [checklistId]: prev[checklistId].map(item =>
            item.id === itemId || item.itemId === itemId
                ? { ...item, status: !item.status }
                : item
            ),
        }));
        } catch {
        toast({ title: 'Gagal update status item', status: 'error' });
        }
    };

    const handleDeleteItem = async (checklistId, itemId) => {
        try {
        await deleteChecklistItem(checklistId, itemId);
        setItemsMap(prev => ({
            ...prev,
            [checklistId]: prev[checklistId].filter(
            item => (item.id || item.itemId) !== itemId
            ),
        }));
        } catch {
        toast({ title: 'Gagal hapus item', status: 'error' });
        }
    };

    const handleDeleteChecklist = async (checklistId) => {
        try {
        await deleteChecklist(checklistId);
        setChecklists(checklists.filter(cl => (cl.id || cl.checklistId) !== checklistId));
        const updatedItems = { ...itemsMap };
        delete updatedItems[checklistId];
        setItemsMap(updatedItems);
        } catch {
        toast({ title: 'Gagal hapus checklist', status: 'error' });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box maxW="3xl" mx="auto" mt={8} p={4}>
        <HStack justify="space-between" mb={6}>
            <Heading size="lg">Checklist Saya</Heading>
            <Button colorScheme="red" size="sm" onClick={handleLogout}>
            Logout
            </Button>
        </HStack>

        <HStack mb={6}>
            <Input
            placeholder="Nama checklist baru"
            value={newChecklistName}
            onChange={e => setNewChecklistName(e.target.value)}
            />
            <Button colorScheme="teal" onClick={handleCreateChecklist}>
            Tambah
            </Button>
        </HStack>

        <VStack align="stretch" spacing={6}>
            {checklists ? checklists.map(checklist => {
            const checklistId = checklist.id || checklist.checklistId;
            const items = itemsMap[checklistId] || [];
            //   console.log('Items for checklist:', checklistId, items);

            return (
                <Box key={checklistId} borderWidth={1} borderRadius="md" p={4}>
                <HStack justify="space-between">
                    <Text fontWeight="bold">{checklist.name}</Text>
                    <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteChecklist(checklistId)}
                    />
                </HStack>

                <VStack align="start" mt={4} spacing={2}>
                    {items.length === 0 && (
                    <Text color="gray.500">Belum ada item</Text>
                    )}
                    {items.map(item => {
                    const itemId = item.id || item.itemId;
                    return (
                        <HStack key={itemId} w="100%" justify="space-between">
                        <HStack>
                            <Checkbox
                            isChecked={item.status === true}
                            onChange={() => handleToggleItem(checklistId, itemId)}
                            />
                            <Text as={item.status ? 'del' : undefined}>
                            {item.name}
                            </Text>
                        </HStack>
                        <IconButton
                            icon={<DeleteIcon />}
                            size="xs"
                            colorScheme="red"
                            onClick={() => handleDeleteItem(checklistId, itemId)}
                        />
                        </HStack>
                    );
                    })}
                </VStack>

                <Divider my={4} />

                <HStack>
                    <Input
                    placeholder="Tambahkan item"
                    size="sm"
                    value={newItemText[checklistId] || ''}
                    onChange={e =>
                        setNewItemText({
                        ...newItemText,
                        [checklistId]: e.target.value,
                        })
                    }
                    />
                    <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleAddItem(checklistId)}
                    >
                    Tambah
                    </Button>
                </HStack>
                </Box>
            );
            }) : "Tidak ada checklist yang tersedia."}
        </VStack>
        </Box>
    );
}

export default DashboardPage;