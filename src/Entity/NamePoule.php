<?php

namespace App\Entity;

use App\Repository\NamePouleRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=NamePouleRepository::class)
 */
class NamePoule
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $LikeYes;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $LikeNo;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getLikeYes(): ?bool
    {
        return $this->LikeYes;
    }

    public function setLikeYes(?bool $LikeYes): self
    {
        $this->LikeYes = $LikeYes;

        return $this;
    }

    public function getLikeNo(): ?bool
    {
        return $this->LikeNo;
    }

    public function setLikeNo(?bool $LikeNo): self
    {
        $this->LikeNo = $LikeNo;

        return $this;
    }
}
