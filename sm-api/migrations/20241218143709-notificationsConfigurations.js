'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('notifications-configurations', [
      {
        id: 1,
        type: 'ORDER_STATUS_UPDATE',
        title_en: 'Order is {{order.status}}!',
        title_es: '¡El pedido es {{order.status}}!',
        body_en: 'Order {{order.id}} is {{order.status}}. Check order details here.',
        body_es:
          'El pedido {{order.id}} es {{order.status}}. Consulta los detalles del pedido aquí.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        type: 'ORDER_DETAILS_UPDATE',
        title_en: 'Order details updated!',
        title_es: '¡Detalles del pedido actualizados!',
        body_en: 'Order {{order.id}} details updated. Check order details here.',
        body_es:
          'Se actualizaron los detalles del pedido {{order.id}}. Verifique los detalles del pedido aquí.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        type: 'STORE_MANAGER_NEW_ORDER',
        title_en: 'New order!',
        title_es: '¡Nuevo orden!',
        body_en: 'Order {{order.id}} has been assigned to your Store. Check order details here.',
        body_es:
          'El pedido {{order.id}} ha sido asignado a su tienda. Verifique los detalles del pedido aquí.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        type: 'DELIVERY_MAN_NEW_ORDER',
        title_en: 'New order!',
        title_es: '¡Nuevo orden!',
        body_en:
          'Order {{order.id}} has been assigned to you for delivery. Check order details and provide answer.',
        body_es:
          'Se le ha asignado el pedido {{order.id}} para su entrega. Verifique los detalles del pedido y proporcione una respuesta.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        type: 'STORE_MANAGER_REJECTED_ORDER',
        title_en: 'Order rejected!',
        title_es: '¡Orden rechazada!',
        body_en:
          'Order {{order.id}} has been rejected by the assigned Delivery man. Assign new Delivery man to the order.',
        body_es:
          'El repartidor asignado ha rechazado el pedido {{order.id}}. Asignar nuevo repartidor al pedido.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        type: 'DELIVERY_MAN_PENDING_ORDER',
        title_en: 'Pending order!',
        title_es: '¡Pedido pendiente!',
        body_en:
          'Order {{order.id}} is ready for delivery. Pick-up the order from the store {{store.name}}.',
        body_es:
          'El pedido {{order.id}} está listo para entrega. Retira el pedido en la tienda {{store.name}}.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 7,
        type: 'STORE_MANAGER_NOT_DELIVERED_ORDER',
        title_en: 'Delivery problem!',
        title_es: '¡Problema de entrega!',
        body_en:
          'Order {{order.id}} has a delivery problem. Check order details and contact Customer.',
        body_es:
          'El pedido {{order.id}} tiene un problema de entrega. Verifique los detalles del pedido y comuníquese con el cliente.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 8,
        type: 'DELIVERY_MAN_REASSIGNED_ORDER',
        title_en: 'Order reassigned!',
        title_es: '¡Orden reasignada!',
        body_en: 'Order {{order.id}} has been reassigned to other Delivery man.',
        body_es: 'La orden {{order.id}} ha sido reasignada a otro repartidor.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('notifications-configurations', 1, {});
    await queryInterface.bulkDelete('notifications-configurations', 2, {});
    await queryInterface.bulkDelete('notifications-configurations', 3, {});
    await queryInterface.bulkDelete('notifications-configurations', 4, {});
    await queryInterface.bulkDelete('notifications-configurations', 5, {});
    await queryInterface.bulkDelete('notifications-configurations', 6, {});
    await queryInterface.bulkDelete('notifications-configurations', 7, {});
    await queryInterface.bulkDelete('notifications-configurations', 8, {});
  },
};
