<?php

use Symfony\Component\Finder\Finder;

/**
 *
 */
class WoodyLibrary
{
    public static function getTemplatesDirname()
    {
        return __DIR__ . '/views';
    }

    public static function getTemplatesByAcfGroup($components, $id)
    {
        $return = [];
        foreach ($components as $component => $val) {
            if (!empty($val['acf_groups'])) {
                if (in_array($id, $val['acf_groups'])) {
                    unset($val['acf_groups']);
                    $return[$component] = $val;
                }
            }
        }

        return $return;
    }

    public static function getTwigsPaths($components)
    {
        $return = [];

        foreach ($components as $key => $val) {
            $return[$key] = $val['twig'];
        }

        return $return;
    }

    public static function getComponents()
    {
        $components = [];

        // Get all folders named tpl_* in $name folder
        $finder = new Finder();
        $finder->name('tpl_*')->directories()->in(self::getTemplatesDirName());

        foreach ($finder as $key => $folder) {

            // Foreach folder, get full and relative path
            $folder_path = $folder->getRealPath();
            $folder_name  = $folder->getRelativePathname();
            $name = str_replace('/', '-', $folder_name);

            // Get all json files (.json) in the targeted folder
            // to add templates[thumbnails]
            $jsonsFinder = new Finder();
            $jsonsFinder->files()->name('*.json')->in($folder_path);
            foreach ($jsonsFinder as $key => $json) {
                $json_data = file_get_contents($json);
                $php_data = json_decode($json_data, true);
                if ($php_data['approved'] == false) {
                    continue;
                }
                if (!empty($php_data['acf_groups'])) {
                    foreach ($php_data['acf_groups'] as $key => $acf_group) {
                        $components[$name]['acf_groups'][] = $acf_group;
                    }
                } else {
                    $components[$name]['acf_groups'][] = '';
                }

                if (!empty($php_data['name'])) {
                    $components[$name]['name'] = $php_data['name'];
                } else {
                    $components[$name]['name'] = '';
                }

                if (!empty($php_data['description'])) {
                    $components[$name]['description'] = $php_data['description'];
                } else {
                    $components[$name]['description'] = '';
                }

                if (!empty($php_data['items_count'])) {
                    $components[$name]['items_count'] = $php_data['items_count'];
                } else {
                    $components[$name]['items_count'] = '';
                }
            }

            // Get all images files (.png) in the targeted folder
            // to add templates[$short_name][thumbnails]
            $thumbsFinder = new Finder();
            $thumbsFinder->files()->name('*.png')->in($folder_path);
            foreach ($thumbsFinder as $thumb) {
                $thumb_realPath = $thumb->getRealPath();
                $thumb_realPath = explode('/', $thumb_realPath);
                $keep = false;
                $url = [];
                foreach ($thumb_realPath as $path_part) {
                    if ($keep == true) {
                        $url[] = $path_part;
                    }
                    if ($path_part == 'views') {
                        $keep = true;
                    }
                }
                $components[$name]['thumbnails']['small'] = implode('/', $url);
            }

            // Get all twig files in the targeted folder
            // to add templates[$short_name]['twig']
            $twigFinder = new Finder();
            $twigFinder->files()->name('*.twig')->in($folder_path);
            foreach ($twigFinder as $twig) {
                $twigRealPath = $twig->getRealPath();
                $twigRealPath = str_replace(self::getTemplatesDirName(), '', $twigRealPath);
                $components[$name]['twig'] = $twigRealPath;
            }
        }

        return $components;
    }
}
