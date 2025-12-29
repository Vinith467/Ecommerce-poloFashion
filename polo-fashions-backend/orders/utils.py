# orders/utils.py

# Full status flow for custom/fabric orders
CUSTOM_STATUS_FLOW = {
    "placed": ["processing"],
    "processing": ["stitching"],
    "stitching": ["buttoning"],
    "buttoning": ["ironing"],
    "ironing": ["ready_for_pickup"],
    "ready_for_pickup": ["picked_up"],
    "picked_up": [],
}

# Simplified flow for ready-made/accessory/innerwear
READYMADE_STATUS_FLOW = {
    "placed": ["processing"],
    "processing": ["ready_for_pickup"],
    "ready_for_pickup": ["picked_up"],
    "picked_up": [],
}

# Rental flow
RENTAL_STATUS_FLOW = {
    "placed": ["processing"],
    "processing": ["ready_for_pickup"],
    "ready_for_pickup": ["picked_up"],
    "picked_up": ["returned"],
    "returned": ["deposit_refunded"],
    "deposit_refunded": [],
}

def get_order_status_flow(order):
    """
    Returns the appropriate status flow based on order type.
    """
    # Rental orders
    if order.rental_days and order.rental_days > 0:
        return RENTAL_STATUS_FLOW
    
    # Ready-made, accessory, innerwear
    if order.order_type in ['ready_made', 'accessory', 'innerwear']:
        return READYMADE_STATUS_FLOW
    
    # Custom/Fabric orders (with or without stitching)
    if order.order_type in ['fabric_only', 'fabric_with_stitching']:
        # If fabric only (no stitching), use simplified flow
        if not order.stitch_type:
            return READYMADE_STATUS_FLOW
        return CUSTOM_STATUS_FLOW
    
    # Traditional with stitching
    if order.order_type == 'traditional' and order.stitch_type:
        return CUSTOM_STATUS_FLOW
    
    # Default to readymade flow
    return READYMADE_STATUS_FLOW


def get_valid_next_statuses(order):
    """
    Returns list of valid next statuses for an order.
    """
    flow = get_order_status_flow(order)
    return flow.get(order.status, [])