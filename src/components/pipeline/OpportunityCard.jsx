import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { Calendar, Building2, MapPin, DollarSign, GripVertical } from 'lucide-react';

export function OpportunityCard({ opportunity, onUpdate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: opportunity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Box {...attributes} {...listeners} sx={{ cursor: 'inherit', color: 'text.secondary' }}>
            <GripVertical size={20} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {opportunity.title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Building2 size={16} />
            <Typography variant="body2" color="text.secondary">
              {opportunity.agency}
            </Typography>
          </Box>

          {opportunity.dueDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={16} />
              <Typography variant="body2" color="text.secondary">
                Due: {formatDate(opportunity.dueDate)}
              </Typography>
            </Box>
          )}

          {opportunity.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin size={16} />
              <Typography variant="body2" color="text.secondary">
                {opportunity.location}
              </Typography>
            </Box>
          )}

          {opportunity.amount && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DollarSign size={16} />
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(opportunity.amount)}
              </Typography>
            </Box>
          )}
        </Box>

        {opportunity.bidProgress > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Bid Progress
            </Typography>
            <Box
              sx={{
                height: 4,
                bgcolor: 'grey.200',
                borderRadius: 1,
                mt: 0.5,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: `${opportunity.bidProgress}%`,
                  height: '100%',
                  bgcolor: 'primary.main'
                }}
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}