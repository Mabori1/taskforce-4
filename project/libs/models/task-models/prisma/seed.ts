import { PrismaClient } from '@prisma/client';
//import { PrismaClient } from '../../../../node_modules/.prisma/client';
const prisma = new PrismaClient();

async function fillDb() {
  await prisma.task.upsert({
    where: { taskId: 1 },
    update: {},
    create: {
      title: 'Собрать шкаф',
      details: 'Шкаф новый. Инструкция имеется',
      price: 300,
      address: 'ул. Мебельная д. 21 кв. 10',
      city: 'Санкт-Петербург',
      customerId: '22',
      status: 'new',
      categories: {
        create: {
          name: 'мебель',
        },
      },
      comments: {
        create: [
          {
            text: 'На первый взгляд - легкая работа',
            userId: '21',
          },
          {
            text: 'Не страшней других.',
            userId: '117',
          },
        ],
      },
      tags: {
        create: [
          {
            name: 'качество',
          },
          {
            name: 'сборка',
          },
          {
            name: 'быстро',
          },
        ],
      },
      review: {
        create: {
          review: 'Отличная работа!',
          evaluation: 5,
          userId: 'kdfa9d8fa8',
        },
      },
    },
  });

  await prisma.task.upsert({
    where: { taskId: 2 },
    update: {},
    create: {
      title: 'Установить фильтр для воды',
      details: 'Фильтр осмос Prestige-3M',
      price: 200,
      address: 'ул. Гагарина д. 11 кв. 42',
      city: 'Москва',
      customerId: '12',
      executerId: '15',
      status: 'new',
      categories: {
        create: {
          name: 'фильтр',
        },
      },
      comments: {
        create: [
          {
            text: 'Работа на 30 минут.',
            userId: '28',
          },
          {
            text: 'Жаль я очень занят...',
            userId: '17',
          },
        ],
      },
      tags: {
        create: [
          {
            name: 'очистка',
          },
          {
            name: 'вода',
          },
          {
            name: 'быстро',
          },
        ],
      },
      review: {
        create: {
          review: 'Очень даже good!',
          evaluation: 4,
          userId: 'ddkdkk2k',
        },
      },
    },
  });

  console.info('🤘️ Database was filled');
}

fillDb()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();

    process.exit(1);
  });
