# orders/utils.py

ORDER_STATUS_FLOW = {
    # Common
    "placed": ["processing"],
    "processing": ["stitching", "ready_for_pickup"],

    # Tailoring
    "stitching": ["buttoning"],
    "buttoning": ["ironing"],
    "ironing": ["ready_for_pickup"],

    # Pickup
    "ready_for_pickup": ["picked_up"],

    # Rental only
    "picked_up": ["returned"],
    "returned": ["deposit_refunded"],

    # Terminal states
    "deposit_refunded": [],
    "cancelled": [],
}
