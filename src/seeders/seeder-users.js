'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.bulkInsert('Users', [{
    email: 'admin@gmai.com',
    password: '123',  //plain text  "aggawvagfds1458" -> hash password
    firstName: 'drew',
    lastName: 'fboii',
    address: 'AG Gang',
    gender: 1,
    typeRole: 'ROLE',
    keyRole: 'R1',
    createdAT: new Date(),
    updatedAT: new Date()
   }]  )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
