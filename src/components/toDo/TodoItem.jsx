import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Paper, Typography, IconButton, Chip, useTheme } from "@mui/material";
import { Trash2, GripVertical, Calendar, AlertCircle, Edit, Tag, Users } from "lucide-react";
import { useTodoStore } from "../../stores/todoStore";

const getPriorityColors = (mode) => ({
  LOW: {
    bgcolor: mode === "dark" ? "rgba(25, 118, 210, 0.15)" : "primary.50",
    color: mode === "dark" ? "#90caf9" : "primary.main",
  },
  MEDIUM: {
    bgcolor: mode === "dark" ? "rgba(237, 108, 2, 0.15)" : "warning.50",
    color: mode === "dark" ? "#ffb74d" : "warning.main",
  },
  HIGH: {
    bgcolor: mode === "dark" ? "rgba(211, 47, 47, 0.15)" : "error.50",
    color: mode === "dark" ? "#ef5350" : "error.main",
  },
});

export function TodoItem({ todo, onEdit, isDragging, teamName }) {
  const theme = useTheme();
  const { removeTodo } = useTodoStore();
  const tags = Array.isArray(todo.tags) ? todo.tags : [];
  const priorityColors = getPriorityColors(theme.palette.mode);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const daysUntilDue = Math.ceil((new Date(todo.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        p: 2,
        mb: 2,
        opacity: isDragging ? 0.5 : 1,
        bgcolor: theme.palette.mode === "dark" ? "grey.800" : "background.paper",
        cursor: isDragging ? "grabbing" : "grab",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isDragging ? "scale(1.05)" : undefined,
        zIndex: isDragging ? 1000 : 1,
        "&:hover": {
          boxShadow: theme.palette.mode === "dark" ? "0 0 10px rgba(0,0,0,0.5)" : 3,
          transform: "translateY(-2px)",
          bgcolor: theme.palette.mode === "dark" ? "grey.700" : "background.paper",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Box {...attributes} {...listeners} sx={{ mr: 2, color: "text.secondary", cursor: "inherit" }}>
          <GripVertical />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 500, color: "text.primary" }}>
              {todo.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size='small'
                onClick={() => onEdit?.(todo)}
                sx={{
                  transition: "all 0.2s ease",
                  color: theme.palette.mode === "dark" ? "grey.400" : "grey.700",
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: theme.palette.mode === "dark" ? "rgba(144, 202, 249, 0.08)" : "primary.50",
                  },
                }}
              >
                <Edit size={18} />
              </IconButton>
              <IconButton
                size='small'
                onClick={() => !isDragging && removeTodo(todo.id)}
                sx={{
                  transition: "all 0.2s ease",
                  color: theme.palette.mode === "dark" ? "error.light" : "error.main",
                  "&:hover": {
                    bgcolor: theme.palette.mode === "dark" ? "rgba(239, 83, 80, 0.08)" : "error.50",
                  },
                }}
              >
                <Trash2 size={18} />
              </IconButton>
            </Box>
          </Box>

          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            {todo.description}
          </Typography>

          {teamName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Users size={14} />
              <Typography variant='caption' color='text.secondary'>
                {teamName}
              </Typography>
            </Box>
          )}

          {tags.length > 0 && (
            <Box sx={{ display: "flex", gap: 0.5, mb: 2, flexWrap: "wrap" }}>
              {tags.map((tag, index) => (
                <Chip
                  key={`${tag}-${index}`}
                  icon={<Tag size={14} />}
                  label={tag}
                  size='small'
                  sx={{
                    borderRadius: "4px",
                    bgcolor: theme.palette.mode === "dark" ? "rgba(156, 39, 176, 0.15)" : "secondary.50",
                    color: theme.palette.mode === "dark" ? "#ce93d8" : "secondary.main",
                    border: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "dark" ? "rgba(156, 39, 176, 0.25)" : "secondary.100",
                    },
                    "& .MuiChip-icon": {
                      color: "inherit",
                    },
                  }}
                />
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Chip
              icon={<AlertCircle size={14} />}
              label={todo.priority}
              size='small'
              sx={{
                ...priorityColors[todo.priority],
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />

            <Chip
              icon={<Calendar size={14} />}
              label={`${daysUntilDue} days left`}
              size='small'
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "grey.100",
                color: theme.palette.mode === "dark" ? "grey.300" : "text.secondary",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "grey.200",
                },
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          </Box>

          {todo.estimatedEffort > 0 && (
            <Typography
              variant='caption'
              sx={{
                display: "block",
                mb: 1,
                color: theme.palette.mode === "dark" ? "grey.400" : "text.secondary",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "grey.300" : "text.primary",
                },
              }}
            >
              Effort: {todo.actualEffort || 0}/{todo.estimatedEffort} hours
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}