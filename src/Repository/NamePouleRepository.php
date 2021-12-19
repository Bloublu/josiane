<?php

namespace App\Repository;

use App\Entity\NamePoule;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method NamePoule|null find($id, $lockMode = null, $lockVersion = null)
 * @method NamePoule|null findOneBy(array $criteria, array $orderBy = null)
 * @method NamePoule[]    findAll()
 * @method NamePoule[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NamePouleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NamePoule::class);
    }

    // /**
    //  * @return NamePoule[] Returns an array of NamePoule objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('n.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?NamePoule
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
