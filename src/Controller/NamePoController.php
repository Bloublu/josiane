<?php

namespace App\Controller;

use App\Form\NamePouleType;
use App\Repository\NamePouleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class NamePoController extends AbstractController
{
    /**
     * @Route ("/Name", name="NamePoIndex")
     */
    public function index(NamePouleRepository $namePouleRepository): Response
    {
        $liste = $namePouleRepository ->findAll();
        return $this->render('name_po/index.html.twig',
            compact("liste")
           );
    }

    /**
     * @Route ("/ajouter", name="NamePoAjout")
     */
    public function ajouter(): Response
    {
        $pouleNameForm = new NamePouleType();
        $PouleForm = $this->createForm(NamePouleType::class, $pouleNameForm);
        return $this->render('name_po/index.html.twig', [
            "PouleForm" => $PouleForm->createView()
        ] );
    }
}
